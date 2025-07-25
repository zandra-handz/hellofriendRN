import React from "react";

type ListItem = {
  user_category_name: string;
  // add other properties if needed
};

type Props = {
  listData: ListItem[];
};

type ReturnType = {
  uniqueCategories: string[];
  categoryCount: number;
  categoryNames: string[];
  categoryStartIndices: Record<string, number>;
};

const useTalkingPCategorySorting = ({ listData }: Props): ReturnType => {
  const categoryStartIndices: Record<string, number> = {};
  const categoryNames: string[] = [];
  const seenCategories = new Set<string>();

  if (!listData || listData.length < 1) {
    return {
      uniqueCategories: [],
      categoryCount: 0,
      categoryNames: [],
      categoryStartIndices: {},
    };
  }

  let index = 0;

  for (const item of listData) {
    const category = item.user_category_name;

    if (typeof category === "string" && !seenCategories.has(category)) {
      seenCategories.add(category);
      categoryStartIndices[category] = index;
      categoryNames.push(category);
    }

    index++;
  }

  return {
    uniqueCategories: categoryNames,
    categoryCount: categoryNames.length,
    categoryNames,
    categoryStartIndices,
  };
};

export default useTalkingPCategorySorting;
