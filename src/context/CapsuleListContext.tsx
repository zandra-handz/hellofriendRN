import { useQuery } from '@tanstack/react-query';
import { useSelectedFriend } from './SelectedFriendContext';
import { fetchMomentsAPI } from '../calls/api';
import { MomentFromBackendType } from '../types/MomentContextTypes';
import useMomentContextFunctions from '../hooks/useMomentContextFunctions';
import useUser from '../hooks/useUser';
import { useCallback } from 'react';

type CategorySize = {
  user_category: number;
  name: string;
  size: number;
  value: number;
};

type CapsuleChartItem = {
  name: string;
  size: number;
  user_category: number;
  value: number;
};

const EMPTY_CAPSULES: MomentFromBackendType[] = [];
const EMPTY_SET = new Set<number>();
const EMPTY_PREADDED: string[] = [];
const EMPTY_CHART_DATA: CapsuleChartItem[] = [];

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
  capsuleChartData: EMPTY_CHART_DATA,
};

const transformCapsuleData = (
  data: MomentFromBackendType[] | undefined,
  getPreAdded: (data: MomentFromBackendType[]) => string[],
) => {
  if (!data || data.length === 0) {
    return EMPTY_RESULT;
  }

  const sortedAll = [...data].sort((a, b) => {
    if (a.user_category_name < b.user_category_name) return -1;
    if (a.user_category_name > b.user_category_name) return 1;
    return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
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
        coord: [c.screen_x, c.screen_y],
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

  const capsuleChartData: CapsuleChartItem[] = capsules.map((c) => ({
    name: c.capsule?.slice(0, 20) ?? 'untitled',
    size: c.charCount ?? c.capsule?.length ?? 1,
    user_category: Number(c.user_category),
    value: c.charCount ?? c.capsule?.length ?? 1,
  }));

  return {
    capsuleList: capsules,
    capsuleCategorySet,
    allCapsulesList: sortedAll,
    preAdded,
    categorySizes,
    capsuleChartData,
  };
};

const momentsQueryOptions = (userId: number, friendId: number) => ({
  queryKey: ['Moments', userId, friendId],
  queryFn: async () => {
    if (!friendId) throw new Error('selectedFriend.id is null');
    return fetchMomentsAPI(friendId);
  },
  enabled: !!(userId && friendId),
  //staleTime: 1000 * 60 * 120,
});

export const useCapsuleList = () => {
  const { selectedFriend } = useSelectedFriend();
  const { user, isInitializing } = useUser();
  const { getPreAdded } = useMomentContextFunctions();

  const selectFn = useCallback(
    (data: MomentFromBackendType[]) => transformCapsuleData(data, getPreAdded),
    [getPreAdded],
  );

  const { data, isPending, isSuccess } = useQuery({
    ...momentsQueryOptions(user?.id ?? 0, selectedFriend?.id ?? 0),
    enabled: !!(selectedFriend?.id && user?.id && !isInitializing),
    select: selectFn,
  });

  return {
    capsuleList: data?.capsuleList ?? EMPTY_CAPSULES,
    capsuleCategorySet: data?.capsuleCategorySet ?? EMPTY_SET,
    allCapsulesList: data?.allCapsulesList ?? EMPTY_CAPSULES,
    preAdded: data?.preAdded ?? EMPTY_PREADDED,
    categorySizes: data?.categorySizes ?? emptyCategorySizes,
    capsuleChartData: data?.capsuleChartData ?? EMPTY_CHART_DATA,
    isPending,
    isSuccess,
  };
};