// useCapsuleColors.ts
import { useMemo, useRef } from 'react';
import { useCapsuleList } from '@/src/context/CapsuleListContext';

export const useCapsuleColors = (categoryColors) => {
  const { capsuleList, capsuleCategorySet, isPending } = useCapsuleList();

  const colorsRef = useRef<{
    colors: string[];
    colorsReversed: string[];
    friend: any;
  }>({
    colors: [],
    colorsReversed: [],
    friend: null,
  });

  if (
    capsuleCategorySet?.size &&
    !isPending &&
    categoryColors?.length &&
    capsuleList?.length
  ) {
    const categoryColorMap = new Map(
      categoryColors
        .filter((item) => capsuleCategorySet.has(item.user_category))
        .map((item) => [item.user_category, item.color]),
    );

    const filteredColors = capsuleList.map(
      (capsule) =>
        categoryColorMap.get(Number(capsule.user_category)) ??
        categoryColors[0]?.color,
    );

    colorsRef.current = {
      colors: filteredColors,
      colorsReversed: filteredColors.slice().reverse(),
      friend: categoryColors[0]?.friend ?? null,
    };
  }

  return colorsRef.current;
};