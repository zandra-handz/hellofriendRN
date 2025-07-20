import { View, Text } from "react-native";
import React from "react";

const useMomentContextFunctions = () => {


    // must have a default string for null names or else this will not sort properly
    // am setting 'No category' in api call response logic

  // const sortByMomentCategory = (dataList) => {
  //   const sorted = [...dataList].sort((a, b) => {
  //     if (a.user_category_name < b.user_category_name) return -1;
  //     if (a.user_category_name > b.user_category_name) return 1;
  //     return new Date(b.created) - new Date(a.created);
  //   });

  //   return sorted;
  // };


  // ids of all moments that have been added to hello

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
