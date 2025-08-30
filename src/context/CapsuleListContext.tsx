import React, {
  createContext,
  useContext,
  useMemo,
} from "react";
import { useSelectedFriend } from "./SelectedFriendContext";
import {
  fetchMomentsAPI, 
} from "../calls/api";
import { useQuery  } from "@tanstack/react-query";
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
        selectedFriend?.id &&
        user?.id 
        &&  
       !isInitializing
      ),
      // staleTime: 0,
      staleTime: 1000 * 60 * 120, // 2 hours

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
 

 
 
  const contextValue = useMemo(
    () => ({
  
      capsuleList: capsules,
      allCapsulesList: allCapsules,
 
      preAdded, 
 
    }),
    [ 
      capsules,
      allCapsules,
   
      preAdded, 
 
    ]
  );

  return (
    <CapsuleListContext.Provider value={contextValue}>
      {children}
    </CapsuleListContext.Provider>
  );
};
