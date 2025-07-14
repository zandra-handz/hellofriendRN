import { View, Text } from "react-native";
import React from "react";

const useStatsSortingFunctions = ({ listData = [], friendId = null }) => {
  const categoryHistorySizes = () => {
    if (!Array.isArray(listData) || listData.length === 0) {
      return { sortedList: [], lookupMap: new Map(), hasAnyCapsules: false };
    }

    const categorySizeMap = new Map();
    let totalCapsuleCount = 0;

    listData.forEach((category) => {
      const categoryId = Number(category.id);
      const categoryName = String(category.name);
      const categorySize =
        category.completed_capsules?.length ||
        category.capsule_ids?.length ||
        0;

      totalCapsuleCount += categorySize;

      categorySizeMap.set(categoryId, {
        name: categoryName,
        size: categorySize,
      });
    });

    const sortedList = Array.from(categorySizeMap.entries())
      .map(([user_category, sizeAndName]) => ({
        user_category,
        name: sizeAndName.name,
        size: sizeAndName.size,
        value: sizeAndName.size,
      }))
      .sort((a, b) => b.size - a.size);

    const hasAnyCapsules = totalCapsuleCount > 0;

    return { sortedList, lookupMap: categorySizeMap, hasAnyCapsules };
  };

  const categoryFriendHistorySizes = () => {
    if (!listData || listData.length === 0)
      return { sortedList: [], lookupMap: new Map(), hasAnyCapsules: false };
    // console.log(listData);
    const categorySizeMap = new Map();
    let totalCapsuleCount = 0;

    listData?.results?.forEach((category) => {
      const categoryId = Number(category.id);
      const categoryName = String(category.name);
      // data will have completed_capsules if full capsules are included; otherwise it will have capsule_ids list only
      const categorySize =
        category.completed_capsules?.length ||
        category.capsule_ids?.length ||
        0;

      totalCapsuleCount += categorySize;

      categorySizeMap.set(categoryId, {
        name: categoryName,
        size: categorySize,
      });
    });

    const sortedList = Array.from(categorySizeMap.entries())
      .map(([user_category, sizeAndName]) => ({
        user_category,
        name: sizeAndName.name,
        size: sizeAndName.size,
        value: sizeAndName.size,
      }))
      .sort((a, b) => b.size - a.size);

    const hasAnyCapsules = totalCapsuleCount > 0;

    return { sortedList, lookupMap: categorySizeMap, hasAnyCapsules };
  };

  // const addCategoryItem = (categorySizeMap, { user_category, name }) => {
  //   const categoryId = Number(user_category);

  //   // Ensure it's always a Map
  //   const newMap = new Map(categorySizeMap instanceof Map ? categorySizeMap : []);

  //   const current = newMap.get(categoryId);
  //   if (current) {
  //     newMap.set(categoryId, {
  //       name: current.name,
  //       size: current.size + 1,
  //     });
  //   } else {
  //     newMap.set(categoryId, {
  //       name,
  //       size: 1,
  //     });
  //   }
  //   const sortedList = Array.from(newMap.entries())
  //     .map(([user_category, { name, size }]) => ({
  //       user_category,
  //       name,
  //       size,
  //       value: size,
  //     }))
  //     .sort((a, b) => b.size - a.size);

  //   return { lookupMap: newMap, sortedList };
  // };

  // const moveCategoryCount = (categorySizeMap, fromUserCategory, toUserCategory, toName) => {
  //   const fromId = Number(fromUserCategory);
  //   const toId = Number(toUserCategory);

  //   const newMap = new Map(categorySizeMap);

  //   // Subtract 1 from fromUserCategory if possible
  //   const fromCurrent = newMap.get(fromId);
  //   if (fromCurrent && fromCurrent.size > 0) {
  //     newMap.set(fromId, {
  //       name: fromCurrent.name,
  //       size: fromCurrent.size - 1,
  //     });
  //   }

  //   // Add 1 to toUserCategory (create if missing)
  //   const toCurrent = newMap.get(toId);
  //   if (toCurrent) {
  //     newMap.set(toId, {
  //       name: toCurrent.name,
  //       size: toCurrent.size + 1,
  //     });
  //   } else {
  //     // If new category, you must provide the name for it
  //     newMap.set(toId, {
  //       name: toName,
  //       size: 1,
  //     });
  //   }

  //   // Build sorted list from newMap
  //   const sortedList = Array.from(newMap.entries())
  //     .map(([user_category, { name, size }]) => ({
  //       user_category,
  //       name,
  //       size,
  //       value: size,
  //     }))
  //     .sort((a, b) => b.size - a.size);

  //     // console.log(`NEW LIST : `, sortedList);

  //   return { lookupMap: newMap, sortedList };
  // };

  const calculatePercentage = (numbers: number[], total: number): number[] => {
    const percentageArray: number[] = [];

    numbers.forEach((number) => {
      const percentage = Math.round((number.size / total) * 100);
      percentageArray.push(percentage);
    });

    // console.log(`percentages: `, percentageArray);

    return percentageArray;
  };

  const generateGradientColors = (data, startColor, endColor) => {
    const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
    const rgbToHex = (rgb) =>
      "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);

    const generateColorForIndex = (index, total) => {
      const t = index / Math.max(total - 1, 1);
      const interpolated = start.map((s, j) =>
        Math.round(s + (end[j] - s) * t)
      );
      return rgbToHex(interpolated);
    };

    return data.map((item, index) => ({
      user_category: item.id,
      color: generateColorForIndex(index, data.length),
    }));
  };

  const generateRandomColors = (data) => {
    const getRandomColor = () => {
      const getRandomChannel = () => Math.floor(Math.random() * 256);
      const rgb = [getRandomChannel(), getRandomChannel(), getRandomChannel()];
      return "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
    };

    return data.map((item) => ({
      user_category: item.id,
      color: getRandomColor(),
    }));
  };

  return {
    categoryHistorySizes,
    categoryFriendHistorySizes,
    calculatePercentage, // used for category sizes
    generateGradientColors,
    generateRandomColors,
  };
};

export default useStatsSortingFunctions;
