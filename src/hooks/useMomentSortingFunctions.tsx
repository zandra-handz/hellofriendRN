import { View, Text } from "react-native";
import React from "react";
import { Moment } from "../types/MomentContextTypes";

import { useCategories } from "../context/CategoriesContext";

type Props = {
  listData: Moment[] | [];

};

const useMomentSortingFunctions = ({ listData} : Props) => {
const { userCategories} = useCategories();

const categorySizes = () => {

 
   console.log("categorySizes called");
  if (!listData || (listData?.length === 0)) return { sortedList: [], lookupMap: new Map() };

  const categorySizeMap = new Map();
 
  listData.forEach((moment: Moment) => {
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

  // Ensure it's always a Map
  const newMap = new Map(categorySizeMap instanceof Map ? categorySizeMap : []);

  const current = newMap.get(categoryId);
  if (current) {
    newMap.set(categoryId, {
      name: current.name,
      size: current.size + 1,
    });
  } else {
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


//   const generateGradientColors = (data, count, startColor, endColor) => {
//   const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
//   const rgbToHex = (rgb) =>
//     '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

//   const start = hexToRgb(startColor);
//   const end = hexToRgb(endColor);

//   return Array.from({ length: count }, (_, i) => {
//     const t = i / Math.max(count - 1, 1);
//     const interpolated = start.map((s, j) =>
//       Math.round(s + (end[j] - s) * t)
//     );
//     return rgbToHex(interpolated);
//   });
// };


// in components:
//to get colors for all categories: data[index].color
//to match colors for cats for friend with the ids here, use something like:
// useEffect(() => {
//   if (categoryColors && tempCategoriesSortedList) {
//     const userCategorySet = new Set(
//       tempCategoriesSortedList.map(item => item.user_category)
//     );

//     const filteredColors = categoryColors
//       .filter(item => userCategorySet.has(item.user_category))
//       .map(item => item.color);  
//     setColors(filteredColors);  
//   }
// }, [categoryColors, tempCategoriesSortedList]);

// to get an array of just colors to work with animations

//this approach allows colors to be consistent between all category lists and existing moments category lists

const generateGradientColors = (data, startColor, endColor) => {
 
  const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
  const rgbToHex = (rgb) =>
    '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  const generateColorForIndex = (index, total) => {
    const t = index / Math.max(total - 1, 1);
    const interpolated = start.map((s, j) =>
      Math.round(s + (end[j] - s) * t)
    );
    return rgbToHex(interpolated);
  };

  const friend = listData?.[0]?.friend;
  console.log(`friend`, friend)
 
  return data.map((item, index) => ({
    user_category: item.id,
    color: generateColorForIndex(index, data.length),
    friend: friend, // to match with new friend to guard against animating leaves too early
  }));
};


const generateGradientColorsMap = (data, startColor, endColor) => {
  const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
  const rgbToHex = (rgb) =>
    '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

 

  const generateColorForIndex = (index, total) => {
    const t = index / Math.max(total - 1, 1);
    const interpolated = start.map((s, j) =>
      Math.round(s + (end[j] - s) * t)
    );
    return rgbToHex(interpolated);
  };

  // Convert to lookup object
  return Object.fromEntries(
    data.map((item, index) => [
      item.id, // user_category !!! WILL BE STRING BECAUSE OBJECT KEYS ARE ALWAYS STRINGS
      generateColorForIndex(index, data.length), // color
    ])
  );
};


const generateRandomColors = (data) => {
  const getRandomColor = () => {
    const getRandomChannel = () => Math.floor(Math.random() * 256);
    const rgb = [getRandomChannel(), getRandomChannel(), getRandomChannel()];
    return (
      '#' +
      rgb.map((c) => c.toString(16).padStart(2, '0')).join('')
    );
  };

  return data.map((item) => ({
    user_category: item.id,
    color: getRandomColor(),
  }));
};


  return {
    categorySizes,
    addCategoryItem,
    moveCategoryCount,
    calculatePercentage, // used for category sizes
    generateGradientColors,
    generateGradientColorsMap,
    generateRandomColors,
  };
};

export default useMomentSortingFunctions;
