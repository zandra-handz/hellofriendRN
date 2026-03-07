 

// import React, {
//   createContext,
//   useContext,
//   useMemo,
//   ReactNode,
// } from "react";
// import { useSelectedFriend } from "./SelectedFriendContext";
// import { fetchMomentsAPI } from "../calls/api";
// import { useQuery } from "@tanstack/react-query";
// // import { useUser } from "./UserContext";
// // import useUser from "../hooks/useUser";
// import { MomentFromBackendType } from "../types/MomentContextTypes";
// import useMomentContextFunctions from "../hooks/useMomentContextFunctions";

// type CategorySize = {
//   user_category: number;
//   name: string;
//   size: number;
//   value: number;
// };

// type CapsuleListContextType = {
//   capsuleList: MomentFromBackendType[];
//   allCapsulesList: MomentFromBackendType[];
//   preAdded: string[];
//   categorySizes: {
//     sortedList: CategorySize[];
//     lookupMap: Map<number, { name: string; size: number }>;
//     categoryStartIndices: Record<string, number>;
//     categoryNames: { category: string; categoryId: number }[];
//   };
// };

// const emptyCategorySizes = {
//   sortedList: [] as CategorySize[],
//   lookupMap: new Map<number, { name: string; size: number }>(),
//   categoryStartIndices: {} as Record<string, number>,
//   categoryNames: [] as { category: string; categoryId: number }[],
// };

// const CapsuleListContext = createContext<CapsuleListContextType>({
//   capsuleList: [],
//   allCapsulesList: [],
//   preAdded: [],
//   categorySizes: emptyCategorySizes,
// });

// export const useCapsuleList = () => {
//   const context = useContext(CapsuleListContext);
//   if (!context)
//     throw new Error("useCapsuleList must be used within a CapsuleListProvider");
//   return context;
// };

// type CapsuleListProviderProps = {
//   children: ReactNode;
// };

// export const CapsuleListProvider = ({ children, userId, isInitializing }: CapsuleListProviderProps) => {
//   const { selectedFriend } = useSelectedFriend();
//   // const { user, isInitializing } = useUser();
//   const { getPreAdded } = useMomentContextFunctions();

//   // Fetch raw moments
//   const { data, isPending, isSuccess } = useQuery<MomentFromBackendType[]>({
//     queryKey: ["Moments", userId, selectedFriend?.id],
//     queryFn: async () => {
//       if (!selectedFriend?.id) throw new Error("selectedFriend.id is null");
//       return fetchMomentsAPI(selectedFriend.id);
//     },
//     enabled: !!(selectedFriend?.id && userId && !isInitializing),
//     staleTime: 1000 * 60 * 120, // 2 hours
//   });

//   // Compute sorted capsules + categorySizes together
//   const sortedCapsuleList = useMemo(() => {
//     if (!data || data.length === 0) {
//       return {
//         capsules: [] as MomentFromBackendType[],
//         allCapsules: [] as MomentFromBackendType[],
//         preAdded: [] as string[],
//         categorySizes: emptyCategorySizes,
//       };
//     }

//     // Sort capsules by category name, then by creation date
//     const sortedAll = [...data].sort((a, b) => {
//       if (a.user_category_name < b.user_category_name) return -1;
//       if (a.user_category_name > b.user_category_name) return 1;
//       return new Date(b.created).getTime() - new Date(a.created).getTime();
//     });

//     const preAdded = getPreAdded(sortedAll);
//     const preAddedSet = new Set(preAdded);

//     const capsules: MomentFromBackendType[] = [];
//     let uniqueIndex = 0;
//     sortedAll.forEach((c) => {
//       if (!preAddedSet.has(c.id)) {
//         capsules.push({
//           ...c,
//           uniqueIndex: uniqueIndex++,
//           charCount: c.capsule?.length ?? 0,
//         });
//       }
//     });

//     // Compute categorySizes
//     const categorySizeMap = new Map<number, { name: string; size: number }>();
//     const categoryStartIndices: Record<string, number> = {};
//     const categoryNames: { category: string; categoryId: number }[] = [];
//     const seenCategories = new Set<string>();

//     capsules.forEach((c, index) => {
//       const categoryId = Number(c.user_category);
//       const categoryName = String(c.user_category_name);

//       const current = categorySizeMap.get(categoryId) || { name: categoryName, size: 0 };
//       categorySizeMap.set(categoryId, { name: current.name, size: current.size + 1 });

//       if (!seenCategories.has(categoryName)) {
//         seenCategories.add(categoryName);
//         categoryStartIndices[categoryName] = index;
//         categoryNames.push({ category: categoryName, categoryId });
//       }
//     });

    

//     const sortedList = Array.from(categorySizeMap.entries())
//       .map(([user_category, { name, size }]) => ({
//         user_category,
//         name,
//         size,
//         value: size,
//       }))
//       .sort((a, b) => b.size - a.size);

//     // const categorySizes = {
//     //   sortedList,
//     //   lookupMap: categorySizeMap,
//     //   categoryStartIndices,
//     //   categoryNames,
//     // };

//     const capsuleCategorySet = new Set(sortedList.map(item => item.user_category));



// const catTotal = sortedList.reduce((acc, item) => acc + item.size, 0);
// const catLabels = categoryNames.map(({ category, categoryId }) => ({
//   name: category,
//   user_category: categoryId,
// }));
// const catDecimals = categoryNames.map(({ category, categoryId }) => {
//   const size = categorySizeMap.get(categoryId)?.size ?? 0;
//   return Number(((size / catTotal) * 100).toFixed(0)) / 100;
// });

// const categorySizes = {
//   sortedList,
//   lookupMap: categorySizeMap,
//   categoryStartIndices,
//   categoryNames,
//   catTotal,        // add
//   catLabels,    // add
//   catDecimals,  // add
// };

  

//     return { capsules, allCapsules: sortedAll, preAdded, categorySizes, capsuleCategorySet };
//   }, [data, getPreAdded]);


  
 
//   const contextValue = useMemo(() => ({
//     capsuleList: sortedCapsuleList.capsules,
//     capsuleCategorySet: sortedCapsuleList.capsuleCategorySet,
//     allCapsulesList: sortedCapsuleList.allCapsules,
//     preAdded: sortedCapsuleList.preAdded,
//     categorySizes: sortedCapsuleList.categorySizes,
//     isPending: isPending,
//     isSuccess: isSuccess,
//   }), [sortedCapsuleList,  isPending, isSuccess]);

//   return (
//     <CapsuleListContext.Provider value={contextValue}>
//       {children}
//     </CapsuleListContext.Provider>
//   );
// };

import { useQuery } from '@tanstack/react-query';
import { useSelectedFriend } from './SelectedFriendContext';
import { fetchMomentsAPI } from '../calls/api';
import { MomentFromBackendType } from '../types/MomentContextTypes';
import useMomentContextFunctions from '../hooks/useMomentContextFunctions';
import useUser from '../hooks/useUser';

type CategorySize = {
  user_category: number;
  name: string;
  size: number;
  value: number;
};

const EMPTY_CAPSULES: MomentFromBackendType[] = [];
const EMPTY_SET = new Set<number>();
const EMPTY_PREADDED: string[] = [];
const emptyCategorySizes = {
  sortedList: [] as CategorySize[],
  lookupMap: new Map<number, { name: string; size: number }>(),
  categoryStartIndices: {} as Record<string, number>,
  categoryNames: [] as { category: string; categoryId: number }[],
  catTotal: 0,
  catLabels: [] as { name: string; user_category: number }[],
  catDecimals: [] as number[],
};

const EMPTY_RESULT = {
  capsuleList: EMPTY_CAPSULES,
  capsuleCategorySet: EMPTY_SET,
  allCapsulesList: EMPTY_CAPSULES,
  preAdded: EMPTY_PREADDED,
  categorySizes: emptyCategorySizes,
};

const transformCapsuleData = (data: MomentFromBackendType[] | undefined, getPreAdded: (data: MomentFromBackendType[]) => string[]) => {
  if (!data || data.length === 0) {
    return EMPTY_RESULT;
  }

  const sortedAll = [...data].sort((a, b) => {
    if (a.user_category_name < b.user_category_name) return -1;
    if (a.user_category_name > b.user_category_name) return 1;
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  const preAdded = getPreAdded(sortedAll);
  const preAddedSet = new Set(preAdded);

  const capsules: MomentFromBackendType[] = [];
  let uniqueIndex = 0;
  sortedAll.forEach((c) => {
    if (!preAddedSet.has(c.id)) {
      capsules.push({
        ...c,
        uniqueIndex: uniqueIndex++,
        charCount: c.capsule?.length ?? 0,
      });
    }
  });
 
  const categorySizeMap = new Map<number, { name: string; size: number }>();
  const categoryStartIndices: Record<string, number> = {};
  const categoryNames: { category: string; categoryId: number }[] = [];
  const seenCategories = new Set<string>();

  capsules.forEach((c, index) => {
    const categoryId = Number(c.user_category);
    const categoryName = String(c.user_category_name);

    const current = categorySizeMap.get(categoryId) || { name: categoryName, size: 0 };
    categorySizeMap.set(categoryId, { name: current.name, size: current.size + 1 });

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

  const capsuleCategorySet = new Set(sortedList.map((item) => item.user_category));

  const catTotal = sortedList.reduce((acc, item) => acc + item.size, 0);
  const catLabels = categoryNames.map(({ category, categoryId }) => ({
    name: category,
    user_category: categoryId,
  }));
  const catDecimals = categoryNames.map(({ category, categoryId }) => {
    const size = categorySizeMap.get(categoryId)?.size ?? 0;
    return Number(((size / catTotal) * 100).toFixed(0)) / 100;
  });

  const categorySizes = {
    sortedList,
    lookupMap: categorySizeMap,
    categoryStartIndices,
    categoryNames,
    catTotal,
    catLabels,
    catDecimals,
  };

  return {
    capsuleList: capsules,
    capsuleCategorySet,
    allCapsulesList: sortedAll,
    preAdded,
    categorySizes,
  };
};

export const useCapsuleList = () => {
  const { selectedFriend } = useSelectedFriend();
  const { user, isInitializing } = useUser();
  const { getPreAdded } = useMomentContextFunctions();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['Moments', user?.id, selectedFriend?.id],
    queryFn: async () => {
      if (!selectedFriend?.id) throw new Error('selectedFriend.id is null');
      return fetchMomentsAPI(selectedFriend.id);
    },
    enabled: !!(selectedFriend?.id && user?.id && !isInitializing),
    staleTime: 1000 * 60 * 120,
    select: (data) => transformCapsuleData(data, getPreAdded),
  });

  return {
    capsuleList: data?.capsuleList ?? EMPTY_CAPSULES,
    capsuleCategorySet: data?.capsuleCategorySet ?? EMPTY_SET,
    allCapsulesList: data?.allCapsulesList ?? EMPTY_CAPSULES,
    preAdded: data?.preAdded ?? EMPTY_PREADDED,
    categorySizes: data?.categorySizes ?? emptyCategorySizes,
    isPending,
    isSuccess,
  };
};