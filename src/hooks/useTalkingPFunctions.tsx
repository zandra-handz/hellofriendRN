import React from "react";
import { View } from "react-native";

interface Props {
  listData: object[];
  friendData: object[];
  categoryCount: number;
}

const useTalkingPFunctions = ({
  listData = [],
  friendData = [],
  categoryCount = 0,
}: Props) => {


  // console.log('useTalkingFunctions rerendered!');
  // const firstFriendData = friendData[0];

  const getLargestCategory = () => { 
    if (listData.length === 0) return null;
    const categoryCounts = {};

    listData.forEach((talkingPoint) => {
      const category = talkingPoint.typedCategory;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });

    const maxCount = Math.max(...Object.values(categoryCounts));
    const mostCapsulesCategories = Object.keys(categoryCounts).filter(
      (category) => categoryCounts[category] === maxCount
    );

    return mostCapsulesCategories[
      Math.floor(Math.random() * mostCapsulesCategories.length)
    ];
  };

  const getCategoryCap = () => { 
      if (friendData.length === 0) return null;
      if (friendData[0].length === 0) return null;
 
    return parseInt(friendData[0].suggestion_settings.category_limit_formula);
  };

  const getCreationsRemaining = () => { 
    return getCategoryCap() - categoryCount;
  };

  return {
    getLargestCategory,
    getCategoryCap,
    getCreationsRemaining,
  };
};

export default useTalkingPFunctions;
