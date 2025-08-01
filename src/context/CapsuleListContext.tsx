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
  preAdded: number[]; // or whatever type preAdded is
  removeCapsules: (capsuleIdsToRemove: number[]) => void;
  updateCapsule: (input: {
    friendId: number;
    capsuleId: number;
    isPreAdded: boolean;
  }) => void;
  updatePreAdded: () => void;
  updateCapsules: (updatedCapsules: any) => void;
  sortByCategory: () => void;
  // add other functions & fields properly typed...
};
const CapsuleListContext = createContext<CapsuleListContextType>({ capsuleList: [],
  capsuleCount: 0,
  categoryCount: 0,
  categoryNames: [],
  categoryStartIndices: {},
  sortedByCategory: [],
  // newestFirst: [],
  preAdded: [],
  removeCapsules: () => {},
  updateCapsule: () => {},
  updatePreAdded: () => {},
  updateCapsules: () => {},
  sortByCategory: () => {},
  // sortNewestFirst: () => {},
});

export const useCapsuleList = () => {
  const context = useContext(CapsuleListContext);
  if (!context)
    throw new Error("useCapsuleList must be used within a CapsuleListProvider");
  return context;
};





export const CapsuleListProvider = ({ children }) => {
  const { selectedFriend } = useSelectedFriend();
  const { user, isInitializing, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  // console.log("CAPSULE LIST RERENDERED");
  const [sortedByCategory, setSortedByCategory] = useState([]);

  const { getPreAdded } = useMomentContextFunctions();
  // const [newestFirst, setNewestFirst] = useState([]);

  const { data: sortedCapsuleList, isLoading: isCapsuleContextLoading } =
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
        isAuthenticated &&
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
            // momentsSavedToHello: [],
          };

        // const sorted = sortByMomentCategory(data);

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
          // capsules: filterPreAdded,
          allCapsules: sorted,
          categoryCount,
          categoryNames,
          categoryStartIndices,
          preAdded,
          // momentsSavedToHello,
        };
      },
    });

  // const {
  //   capsules = [],
  //   allCapsules = [],
  //   categoryCount = 0,
  //   categoryNames = [],
  //   categoryStartIndices = {},
  //   preAdded = [],
  //   // momentsSavedToHello = [],
  // } = sortedCapsuleList;

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

  // const updateCacheWithEditedMoment = () => {
  //   if (momentData) {
  //     queryClient.setQueryData(
  //       ["Moments", user?.id, selectedFriend?.id],
  //       (oldMoments) => {
  //         if (!oldMoments) return [momentData];

  //         const updatedMoments = [...oldMoments];
  //         const momentIndex = oldMoments.findIndex(
  //           (moment) => moment.id === momentData.id
  //         );
  //         if (momentIndex !== -1) {
  //           updatedMoments[momentIndex] = {
  //             ...updatedMoments[momentIndex],
  //             ...momentData,
  //             //preAdded: true,
  //           };
  //         } else {
  //           updatedMoments.unshift(momentData); // Add new moment if it doesn't exist
  //         }
  //         updateCapsuleMutation.reset();

  //         return updatedMoments;
  //       }
  //     );
  //   }
  // };

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
      // console.log(`successfully connected category!`, data.user_category);
      const formattedMoment = {
        id: data.id,
        typedCategory: data.typed_category || "Uncategorized",
        capsule: data.capsule,
        created: data.created_on,
        preAdded: data.pre_added_to_hello,
        user_category: data.user_category || null,
        user_category_name: data.user_category_name || null,
      };

      console.log("formatted moments data", formattedMoment);

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
    console.log(`moment data in handleCreateMoment`, momentData);
    const moment = {
      user: momentData.user,
      friend: momentData.friend,

     // typed_category: momentData.selectedCategory, // OBSOLETE/ CAN BE NULL/BLANK ON BACKEND
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

  const sortByCategory = () => {
    const sorted = [...capsules].sort((a, b) => {
      if (a.typedCategory < b.typedCategory) return -1;
      if (a.typedCategory > b.typedCategory) return 1;
      return new Date(b.created) - new Date(a.created);
    });

    setSortedByCategory(sorted);
  };

  // const sortNewestFirst = () =>
  //   setNewestFirst(
  //     [...capsules].sort((a, b) => new Date(b.created) - new Date(a.created))
  //   );

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
