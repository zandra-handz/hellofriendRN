import { View, Text } from "react-native";
import React from "react";

const useMomentSortingFunctions = ({ listData = [] }) => {


const categorySizes = () => {
  // console.log("categorySizes called");
  if (listData.length === 0) return { sortedList: [], lookupMap: new Map() };

  const categorySizeMap = new Map();
 
  listData.forEach((moment) => {
    const categoryId = Number(moment?.user_category);
    const categoryName = String(moment?.user_category_name);
    const currentSizeAndName = categorySizeMap.get(categoryId) || {size: 0, name: categoryName};

    categorySizeMap.set(categoryId, {name: currentSizeAndName.name, size: currentSizeAndName.size + 1});
  });
 
  const sortedList = Array.from(categorySizeMap.entries())
    .map(([user_category, sizeAndName]) => ({
      user_category,
      name: sizeAndName.name,
      size: sizeAndName.size,
      value: sizeAndName.size,
    }))
    .sort((a, b) => b.size - a.size);

  return { sortedList, lookupMap: categorySizeMap };
};

const addCategoryItem = (categorySizeMap, { user_category, name }) => {
  const categoryId = Number(user_category);
 
  const newMap = new Map(categorySizeMap);

  const current = newMap.get(categoryId);
  if (current) { 
    newMap.set(categoryId, {
      name: current.name,
      size: current.size + 1,
    });
  } else {
    // New category: set size to 1
    newMap.set(categoryId, {
      name,
      size: 1,
    });
  }
 
  const sortedList = Array.from(newMap.entries())
    .map(([user_category, { name, size }]) => ({
      user_category,
      name,
      size,
      value: size,
    }))
    .sort((a, b) => b.size - a.size);

  return { lookupMap: newMap, sortedList };
};

const moveCategoryCount = (categorySizeMap, fromUserCategory, toUserCategory, toName) => {
  const fromId = Number(fromUserCategory);
  const toId = Number(toUserCategory);

  const newMap = new Map(categorySizeMap);

  // Subtract 1 from fromUserCategory if possible
  const fromCurrent = newMap.get(fromId);
  if (fromCurrent && fromCurrent.size > 0) {
    newMap.set(fromId, {
      name: fromCurrent.name,
      size: fromCurrent.size - 1,
    });
  }

  // Add 1 to toUserCategory (create if missing)
  const toCurrent = newMap.get(toId);
  if (toCurrent) {
    newMap.set(toId, {
      name: toCurrent.name,
      size: toCurrent.size + 1,
    });
  } else {
    // If new category, you must provide the name for it
    newMap.set(toId, {
      name: toName,
      size: 1,
    });
  }

  // Build sorted list from newMap
  const sortedList = Array.from(newMap.entries())
    .map(([user_category, { name, size }]) => ({
      user_category,
      name,
      size,
      value: size,
    }))
    .sort((a, b) => b.size - a.size);

    // console.log(`NEW LIST : `, sortedList);

  return { lookupMap: newMap, sortedList };
};


const calculatePercentage = (
  numbers: number[],
  total: number,
): number[] => {
  const percentageArray: number[] = [];

  numbers.forEach(number => {
    const percentage = Math.round((number.size / total) * 100);
    percentageArray.push(percentage);
  });

  console.log(`percentages: `, percentageArray);

  return percentageArray;
};




  return {
    categorySizes,
    addCategoryItem,
    moveCategoryCount,
    calculatePercentage, // used for category sizes
  };
};

export default useMomentSortingFunctions;
