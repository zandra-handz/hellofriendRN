import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
import Pie from "../headers/Pie"; 
type Props = {
  friendData: object;
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;
colors: any;
seriesData: any;
  radius: number;
  labelsSize: number;
 
  showFooterLabel: boolean;
};

const FriendHistoryMiniPie  = ({
 data,
 colors,
 seriesData,
  listData,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
  showLabels = true,
 
  showFooterLabel,
}: Props) => { 
 

//   useEffect(() => {
//     if (listData) { 
//       let categories = categoryHistorySizes();

//       setFriendHistorySortedList(categories.sortedList);
//       setFriendHistoryHasAnyCapsules(categories.hasAnyCapsules);
//     }
//   }, [listData]);

 

 
  return (
    <>
  
        <View
          style={{
            height: "100%",
            marginHorizontal: 10,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Pie
            showPercentages={showPercentages}
            showLabels={showLabels}
           // data={friendHistorySortedList}
        //    colors={colors}
           seriesData={seriesData}
            // data={data}
            widthAndHeight={radius * 2}
            labelsSize={labelsSize} 
            // onSectionPress={handleCategoryPress}
          />
 
        </View>
  

    </>
  );
};

export default FriendHistoryMiniPie;
