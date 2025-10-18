import React, {
  createContext,
  useContext,
  useMemo,
  useState,
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
  allCapsulesList: MomentFromBackendType[];
  preAdded: number[]; 
};

const CapsuleListContext = createContext<CapsuleListContextType>({
  capsuleList: [],
  allCapsulesList: [],
  preAdded: [], 

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
  
  const [isProcessing, setIsProcessing] = useState(false);

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


















// import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
// import { useSelectedFriend } from "./SelectedFriendContext";
// import { fetchMomentsAPI } from "../calls/api";
// import { useQuery } from "@tanstack/react-query";
// import { useUser } from "./UserContext";
// import { MomentFromBackendType } from "../types/MomentContextTypes";
// import useMomentContextFunctions from "../hooks/useMomentContextFunctions";

// type CapsuleListContextType = {
//   capsuleList: MomentFromBackendType[];
//   allCapsulesList: MomentFromBackendType[];
//   preAdded: number[];
// };

// type CapsuleListProviderProps = { children: ReactNode };

// const CapsuleListContext = createContext<CapsuleListContextType>({
//   capsuleList: [],
//   allCapsulesList: [],
//   preAdded: [],
// });

// export const useCapsuleList = () => {
//   const context = useContext(CapsuleListContext);
//   if (!context)
//     throw new Error("useCapsuleList must be used within a CapsuleListProvider");
//   return context;
// };

// export const CapsuleListProvider = ({ children }: CapsuleListProviderProps) => {
//   const { selectedFriend } = useSelectedFriend();
//   const { user, isInitializing } = useUser();
//   const { getPreAdded } = useMomentContextFunctions();

//   // Fetch raw moments
//   const { data } = useQuery<MomentFromBackendType[]>({
//     queryKey: ["Moments", user?.id, selectedFriend?.id],
//     queryFn: () => {
//       if (!selectedFriend?.id) throw new Error("selectedFriend.id is null");
//       return fetchMomentsAPI(selectedFriend.id);
//     },
//     enabled: !!(selectedFriend?.id && user?.id && !isInitializing),
//     staleTime: 1000 * 60 * 120, // 2 hours
//   });

 

//   // Move the previous `select` logic into a memo
//   const sortedCapsuleList = useMemo(() => {
 
//     if (!data)
//       return {
//         capsules: [],
//         allCapsules: [],
//         categoryCount: 0,
//         categoryNames: [],
//         categoryStartIndices: {},
//         preAdded: [],
//       };

//     const sorted = [...data].sort((a, b) => {
//       if (a.user_category_name < b.user_category_name) return -1;
//       if (a.user_category_name > b.user_category_name) return 1;
//       return new Date(b.created).getTime() - new Date(a.created).getTime();
//     });

//     const preAdded = getPreAdded(sorted);
//     const preAddedSet = new Set(preAdded);

//     const sortedWithIndices: MomentFromBackendType[] = [];
//     let uniqueIndex = 0;

//     for (const capsule of sorted) {
//       if (!preAddedSet.has(capsule.id)) {
//         sortedWithIndices.push({
//           ...capsule,
//           uniqueIndex: uniqueIndex++,
//           charCount: capsule.capsule?.length ?? 0,
//         });
//       }
//     }

//     // Derive categories
//     const categoryNames = [...new Set(sorted.map((c) => c.user_category_name))];
//     const categoryCount = categoryNames.length;
//     const categoryStartIndices: Record<string, number> = {};
//     categoryNames.forEach((name) => {
//       const firstIndex = sorted.findIndex((c) => c.user_category_name === name);
//       if (firstIndex !== -1) categoryStartIndices[name] = firstIndex;
//     });

//     return {
//       capsules: sortedWithIndices,
//       allCapsules: sorted,
//       categoryCount,
//       categoryNames,
//       categoryStartIndices,
//       preAdded,
//     };
//   }, [data, getPreAdded]);

//   // Destructure exactly as before
//   const {
//     capsules = [],
//     allCapsules = [],
//     categoryCount = 0,
//     categoryNames = [],
//     categoryStartIndices = {},
//     preAdded = [],
//   } = sortedCapsuleList ?? {};

//   // Memoized context value
//   const contextValue = useMemo(
//     () => ({
//       capsuleList: capsules,
//       allCapsulesList: allCapsules,
//       preAdded,
//     }),
//     [capsules, allCapsules, preAdded]
//   );

//   return (
//     <CapsuleListContext.Provider value={contextValue}>
//       {children}
//     </CapsuleListContext.Provider>
//   );
// };
