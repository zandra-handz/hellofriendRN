import { View, Text } from "react-native";
import React from "react";

const useMomentContextFunctions = () => {

  

  const getPreAdded = (sortedList) => {
    const preAdded = sortedList.reduce((ids, capsule) => {
      if (capsule.preAdded) ids.push(capsule.id);
      return ids;
    }, []);

    return preAdded;
  };

  return {
    // sortByMomentCategory,
    getPreAdded,
  };
};

export default useMomentContextFunctions;
