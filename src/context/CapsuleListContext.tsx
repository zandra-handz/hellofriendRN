 

import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { useSelectedFriend } from "./SelectedFriendContext";
import { fetchMomentsAPI } from "../calls/api";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import { MomentFromBackendType } from "../types/MomentContextTypes";
import useMomentContextFunctions from "../hooks/useMomentContextFunctions";

type CategorySize = {
  user_category: number;
  name: string;
  size: number;
  value: number;
};

type CapsuleListContextType = {
  capsuleList: MomentFromBackendType[];
  allCapsulesList: MomentFromBackendType[];
  preAdded: string[];
  categorySizes: {
    sortedList: CategorySize[];
    lookupMap: Map<number, { name: string; size: number }>;
    categoryStartIndices: Record<string, number>;
    categoryNames: { category: string; categoryId: number }[];
  };
};

const emptyCategorySizes = {
  sortedList: [] as CategorySize[],
  lookupMap: new Map<number, { name: string; size: number }>(),
  categoryStartIndices: {} as Record<string, number>,
  categoryNames: [] as { category: string; categoryId: number }[],
};

const CapsuleListContext = createContext<CapsuleListContextType>({
  capsuleList: [],
  allCapsulesList: [],
  preAdded: [],
  categorySizes: emptyCategorySizes,
});

export const useCapsuleList = () => {
  const context = useContext(CapsuleListContext);
  if (!context)
    throw new Error("useCapsuleList must be used within a CapsuleListProvider");
  return context;
};

type CapsuleListProviderProps = {
  children: ReactNode;
};

export const CapsuleListProvider = ({ children }: CapsuleListProviderProps) => {
  const { selectedFriend } = useSelectedFriend();
  const { user, isInitializing } = useUser();
  const { getPreAdded } = useMomentContextFunctions();

  // Fetch raw moments
  const { data, isPending, isSuccess } = useQuery<MomentFromBackendType[]>({
    queryKey: ["Moments", user?.id, selectedFriend?.id],
    queryFn: async () => {
      if (!selectedFriend?.id) throw new Error("selectedFriend.id is null");
      return fetchMomentsAPI(selectedFriend.id);
    },
    enabled: !!(selectedFriend?.id && user?.id && !isInitializing),
    staleTime: 1000 * 60 * 120, // 2 hours
  });

  // Compute sorted capsules + categorySizes together
  const sortedCapsuleList = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        capsules: [] as MomentFromBackendType[],
        allCapsules: [] as MomentFromBackendType[],
        preAdded: [] as string[],
        categorySizes: emptyCategorySizes,
      };
    }

    // Sort capsules by category name, then by creation date
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

    // Compute categorySizes
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

    const categorySizes = {
      sortedList,
      lookupMap: categorySizeMap,
      categoryStartIndices,
      categoryNames,
    };

    const capsuleCategorySet = new Set(sortedList.map(item => item.user_category));

  

    return { capsules, allCapsules: sortedAll, preAdded, categorySizes, capsuleCategorySet };
  }, [data, getPreAdded]);

 
  const contextValue = useMemo(() => ({
    capsuleList: sortedCapsuleList.capsules,
    capsuleCategorySet: sortedCapsuleList.capsuleCategorySet,
    allCapsulesList: sortedCapsuleList.allCapsules,
    preAdded: sortedCapsuleList.preAdded,
    categorySizes: sortedCapsuleList.categorySizes,
    isPending: isPending,
    isSuccess: isSuccess,
  }), [sortedCapsuleList,  isPending, isSuccess]);

  return (
    <CapsuleListContext.Provider value={contextValue}>
      {children}
    </CapsuleListContext.Provider>
  );
};
