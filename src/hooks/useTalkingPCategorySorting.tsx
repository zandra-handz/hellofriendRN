import { View, Text } from "react-native";
import React from "react";

type Props = {
  listData: object[];
};
const useTalkingPCategorySorting = ({ listData }: Props) => {
  if (!listData || listData.length < 1) return;

  const categoryStartIndices: Record<string, number> = {};
  const categoryNames: string[] = [];
  const seenCategories = new Set<string>();

  let index = 0;

  for (const item of listData) {
    const category = item.user_category_name;

    if (!seenCategories.has(category)) {
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