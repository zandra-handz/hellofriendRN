import React, {
  useRef,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import { useSelectedFriend } from "./SelectedFriendContext";
import {
  fetchMomentsAPI,
  saveMomentAPI,
  updateMomentAPI,
  updateMultMomentsAPI,
  deleteMomentAPI,
} from "../calls/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import { MomentFromBackendType } from "../types/MomentContextTypes";
import useMomentContextFunctions from "../hooks/useMomentContextFunctions";

type CapsuleListContextType = {
  capsuleList: MomentFromBackendType[];
  capsuleCount: number;
  categoryCount: number;
  categoryNames: string[];
  categoryStartIndices: Record<string, number>;
  sortedByCategory: MomentFromBackendType[];
  preAdded: number[];  
  removeCapsules: (capsuleIdsToRemove: number[]) => void;
  updateCapsule: (input: {
    friendId: number;
    capsuleId: number;
    isPreAdded: boolean;
  }) => void;
  updatePreAdded: () => void;
  updateCapsules: (updatedCapsules: any) => void;
  sortByCategory: () => void; 
};
const CapsuleListContext = createContext<CapsuleListContextType>({ capsuleList: [],
  capsuleCount: 0,
  categoryCount: 0,
  categoryNames: [],
  categoryStartIndices: {},
  sortedByCategory: [], 
  preAdded: [],
  removeCapsules: () => {},
  updateCapsule: () => {},
  updatePreAdded: () => {},
  updateCapsules: () => {},
  sortByCategory: () => {}, 
});

export const useCapsuleList = () => {
  const context = useContext(CapsuleListContext);
  if (!context)
    throw new Error("useCapsuleList must be used within a CapsuleListProvider");
  return context;
};





export const CapsuleListProvider = ({ children }) => {
  const { selectedFriend } = useSelectedFriend();
  const { user, isInitializing  } = useUser();
  const queryClient = useQueryClient(); 

  const { getPreAdded } = useMomentContextFunctions(); 

  const { data: sortedCapsuleList} =
    useQuery<MomentFromBackendType[]>({
      queryKey: ["Moments", user?.id, selectedFriend?.id],
      queryFn: () => {
        if (!selectedFriend?.id) {
          throw new Error("selectedFriend.id is null");
        }
        return fetchMomentsAPI(selectedFriend.id);
      },
      enabled: !!(
        selectedFriend &&
        selectedFriend.id &&
        user?.id &&
        !isInitializing
      ),
      // staleTime: 0,
      staleTime: 1000 * 60 * 20, // 20 minutes

      select: (data) => {
        if (!data)
          return {
            capsules: [],
            categoryCount: 0,
            categoryNames: [],
            categoryStartIndices: {},
            preAdded: [], 
          };
 

        const sorted = [...data].sort((a, b) => {
          if (a.user_category_name < b.user_category_name) return -1;
          if (a.user_category_name > b.user_category_name) return 1;
          return new Date(b.created) - new Date(a.created);
        });

        const preAdded = getPreAdded(sorted);
        const preAddedSet = new Set(preAdded); // O(1) lookup

        const sortedWithIndices = [];
        let uniqueIndex = 0;

        for (const capsule of sorted) {
          if (!preAddedSet.has(capsule.id)) {
            sortedWithIndices.push({
              ...capsule,
              uniqueIndex: uniqueIndex++,
              charCount: capsule.capsule.length | 0,
            });
          }
        }

        return {
          capsules: sortedWithIndices, 
          allCapsules: sorted,
          categoryCount,
          categoryNames,
          categoryStartIndices,
          preAdded, 
        };
      },
    });
 

  const {
  capsules = [],
  allCapsules = [],
  categoryCount = 0,
  categoryNames = [],
  categoryStartIndices = {},
  preAdded = [],
} = sortedCapsuleList ?? {};

  const capsuleCount = capsules.length;
  const timeoutRef = useRef(null);
 

  const handleEditMoment = (capsuleId, capsuleEditData) => {
    editMomentMutation.mutate({ capsuleId, capsuleEditData });
  };

  const editMomentMutation = useMutation({
    mutationFn: ({ capsuleId, capsuleEditData }) =>
      updateMomentAPI(selectedFriend?.id, capsuleId, capsuleEditData),

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["Moments", user?.id, selectedFriend?.id],
        (oldMoments) => {
          if (!oldMoments) return [];

          return oldMoments.map((moment) =>
            moment.id === data.id ? { ...moment, ...data } : moment
          );
        }
      );

      //THIS WILL CAUSE FRIEND DASHBOARD DATA TO RERENDER, FUCK IF I KNOW WHY. THE ABOVE CODE IS SUFFICIENT ANYWAY ! :)
      //queryClient.invalidateQueries(["Moments", user?.id, selectedFriend?.id]);

      //(THIS IS ALSO NOT NEEDED)
      // queryClient.setQueryData(
      //   ["Moments", user?.id, selectedFriend?.id],
      //   (oldMoments) => {
      //     //REMOVING TO CHANGE CAPSULE LIST LENGTH IN MOMENTS SCREEN OTHERWISE WON'T UPDATE
      //     const updatedMoments = oldMoments
      //       ? oldMoments.filter((moment) => moment.id !== data.id)
      //       : [];

      //     return updatedMoments;
      //   }
      // );
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        editMomentMutation.reset();
      }, 500);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        editMomentMutation.reset();
      }, 500);
    },
  });

  const updateCacheWithNewPreAdded = (momentData, isPreAdded) => {
    queryClient.setQueryData(
      ["Moments", user?.id, selectedFriend?.id],
      (oldMoments) => {
        if (!oldMoments) return [{ ...momentData, preAdded: isPreAdded }];

        const updatedMoments = [...oldMoments];
        const momentIndex = updatedMoments.findIndex(
          (moment) => moment.id === momentData.id
        );

        if (momentIndex !== -1) {
          updatedMoments[momentIndex] = {
            ...updatedMoments[momentIndex],
            ...momentData,
            preAdded: isPreAdded,
          };
        } else {
          // Insert new moment with preAdded status
          updatedMoments.unshift({
            ...momentData,
            preAdded: isPreAdded,
          });
        }

        updateCapsuleMutation.reset();

        return updatedMoments;
      }
    );
  };

 

  const updateCapsule = ({
    friendId,
    capsuleId,
    isPreAdded,
  }: {
    friendId: number;
    capsuleId: number;
    isPreAdded: boolean;
  }) => updateCapsuleMutation.mutate({ friendId, capsuleId, isPreAdded });


type UpdateCapsuleInput = {
  friendId: number;
  capsuleId: number;
  isPreAdded: boolean;
};

const updateCapsuleMutation = useMutation({
  mutationFn: ({ friendId, capsuleId, isPreAdded }: UpdateCapsuleInput) =>
    updateMomentAPI(friendId, capsuleId, {
      pre_added_to_hello: isPreAdded,
    }),

  onSuccess: (data) => {
    queryClient.getQueryData(["Moments", user?.id, selectedFriend?.id]);
    updateCacheWithNewPreAdded(data, data?.pre_added_to_hello);
  },

  onError: () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateCapsuleMutation.reset();
    }, 500);
  },
});








  const updateCapsulesMutation = useMutation({
    mutationFn: (updatedCapsules) =>
      updateMultMomentsAPI(selectedFriend?.id, updatedCapsules),
    onSuccess: () =>
      //REMOVE/REPLACE MAYBE IF THIS ALSO CAUSES FDD TO RERENDER?
      //IS THIS MUTATION STILL BEING USED??
      queryClient.invalidateQueries(["Moments", user?.id, selectedFriend?.id]),

    onError: (error) => console.error("Error updating capsule:", error),
  });

  const updateCapsules = (updatedCapsules) =>
    updateCapsulesMutation.mutate(updatedCapsules);

  const createMomentMutation = useMutation({
    mutationFn: (data) => saveMomentAPI(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        createMomentMutation.reset();
      }, 500);
    },
    onSuccess: (data) => {
      const formattedMoment = {
        id: data.id,
        typedCategory: data.typed_category || "Uncategorized",
        capsule: data.capsule,
        created: data.created_on,
        preAdded: data.pre_added_to_hello,
        user_category: data.user_category || null,
        user_category_name: data.user_category_name || null,
      };
 

      queryClient.setQueryData(
        ["Moments", user?.id, selectedFriend?.id],
        (old) => (old ? [formattedMoment, ...old] : [formattedMoment])
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        createMomentMutation.reset();
      }, 500);
    },
  });

  const resetCreateMomentInputs = ({ setMomentText }) => {
    setMomentText("");
  };

  const handleCreateMoment = async (momentData) => { 
 
    const moment = {
       user: user?.id,
 
      friend: momentData.friend,
  capsule: momentData.moment,
      user_category: momentData.selectedUserCategory,
    };

    try {
      await createMomentMutation.mutateAsync(moment);
    } catch (error) {
      console.error("Error saving moment:", error);
    }
  };

  const deleteMomentRQuery = async (data) => {
    try {
      await deleteMomentMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMomentMutation = useMutation({
    mutationFn: (data) => deleteMomentAPI(data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["Moments", user?.id, selectedFriend?.id],
        (old) => {
          return old ? old.filter((moment) => moment.id !== data.id) : [];
        }
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
      }, 500);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
      }, 500);
    },
  });

  const removeCapsules = (capsuleIdsToRemove) => {
    queryClient.setQueryData(
      ["Moments", user?.id, selectedFriend?.id],
      (oldCapsules) =>
        oldCapsules.filter(
          (capsule) => !capsuleIdsToRemove.includes(capsule.id)
        )
    );
  };

 
  const contextValue = useMemo(
    () => ({
      updateCacheWithNewPreAdded,
      capsuleList: capsules,
      allCapsulesList: allCapsules,
      capsuleCount,
      preAdded,
      updateCapsules,
      deleteMomentRQuery,
      deleteMomentMutation,
      removeCapsules,
      handleCreateMoment,
      createMomentMutation,
      resetCreateMomentInputs,
      updateCapsule,
      updateCapsuleMutation,
      handleEditMoment,
      editMomentMutation,
    }),
    [
      updateCacheWithNewPreAdded,
      capsules,
      allCapsules,
      capsuleCount,
      preAdded,
      updateCapsules,
      deleteMomentRQuery,
      deleteMomentMutation,
      removeCapsules,
      handleCreateMoment,
      createMomentMutation,
      resetCreateMomentInputs,
      updateCapsule,
      updateCapsuleMutation,
      handleEditMoment,
      editMomentMutation,
    ]
  );

  return (
    <CapsuleListContext.Provider value={contextValue}>
      {children}
    </CapsuleListContext.Provider>
  );
};
