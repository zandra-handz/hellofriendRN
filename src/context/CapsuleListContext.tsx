import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
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



const categorySizes = useMemo(() => {
  console.log("categorySizes called");

  if (!capsules || capsules.length === 0) {
    return { sortedList: [], lookupMap: new Map(), categoryStartIndices: {}, categoryNames: [] };
  }

  const categorySizeMap = new Map<number, { name: string; size: number }>();
  const categoryStartIndices: Record<string, number> = {};
  const categoryNames: { category: string; categoryId: number }[] = [];
  const seenCategories = new Set<string>();

  capsules.forEach((moment: Moment, index: number) => {
    const categoryId = Number(moment.user_category);
    const categoryName = String(moment.user_category_name);

    // Count sizes
    const current = categorySizeMap.get(categoryId) || { name: categoryName, size: 0 };
    categorySizeMap.set(categoryId, { name: current.name, size: current.size + 1 });

    // Capture start indices & unique names
    if (!seenCategories.has(categoryName)) {
      seenCategories.add(categoryName);
      categoryStartIndices[categoryName] = index;
      categoryNames.push({ category: categoryName, categoryId });
    }
  });

  const sortedList = Array.from(categorySizeMap.entries())
    .map(([user_category, { name, size }]) => ({
      user_category,
      name,
      size,
      value: size,
    }))
    .sort((a, b) => b.size - a.size);

  return { sortedList, lookupMap: categorySizeMap, categoryStartIndices, categoryNames };
}, [capsules]);


//  const categorySizes = useMemo(() => {
//    console.log("categorySizes called");
//   if (!capsules|| (capsules?.length === 0)) return { sortedList: [], lookupMap: new Map() };

//   const categorySizeMap = new Map();
 
//   capsules.forEach((moment: Moment) => {
//     const categoryId = Number(moment?.user_category);
//     const categoryName = String(moment?.user_category_name);
//     const currentSizeAndName = categorySizeMap.get(categoryId) || {size: 0, name: categoryName};

//     categorySizeMap.set(categoryId, {name: currentSizeAndName.name, size: currentSizeAndName.size + 1});
//   });
 
//   const sortedList = Array.from(categorySizeMap.entries())
//     .map(([user_category, sizeAndName]) => ({
//       user_category,
//       name: sizeAndName.name,
//       size: sizeAndName.size,
//       value: sizeAndName.size,
//     }))
//     .sort((a, b) => b.size - a.size);

//   return { sortedList, lookupMap: categorySizeMap };

//  }, [capsules]);
 

 
 
  const contextValue = useMemo(
    () => ({
  
      capsuleList: capsules,
      allCapsulesList: allCapsules,
      preAdded, 
      categorySizes,
 
    }),
    [ 
      capsules,
      allCapsules,
      preAdded, 
      categorySizes,
 
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
