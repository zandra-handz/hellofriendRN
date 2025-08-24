import React, {
 
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import { useSelectedFriend } from "./SelectedFriendContext";
import {
  fetchMomentsAPI,
 
  updateMultMomentsAPI,
 
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
        user?.id 
        &&  
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

 

  const resetCreateMomentInputs = ({ setMomentText }) => {
    setMomentText("");
  };

 
 
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
  
      capsuleList: capsules,
      allCapsulesList: allCapsules,
      capsuleCount,
      preAdded,
      updateCapsules, 
      removeCapsules, 
      resetCreateMomentInputs,
      // updateCapsule,
      // updateCapsuleMutation,
 
    }),
    [ 
      capsules,
      allCapsules,
      capsuleCount,
      preAdded,
      updateCapsules, 
      removeCapsules, 
      resetCreateMomentInputs,
      // updateCapsule,
      // updateCapsuleMutation,
 
    ]
  );

  return (
    <CapsuleListContext.Provider value={contextValue}>
      {children}
    </CapsuleListContext.Provider>
  );
};
