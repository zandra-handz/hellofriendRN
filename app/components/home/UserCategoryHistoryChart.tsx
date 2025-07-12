import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
import { useUserStats } from "@/src/context/UserStatsContext";
import { useFocusEffect } from "@react-navigation/native";
import Pie from "../headers/Pie"; 
import CategoryHistoryModal from "../headers/CategoryHistoryModal";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  radius: number;
};

const UserCategoryHistoryChart = ({ listData, radius = 80 }: Props) => {
  // console.log(`listdata in usercategoryhistory chart`, listData);
  const [userHistorySortedList, setUserHistorySortedList] = useState([]);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const { handleGetCategoryCapsules } = useUserStats();
  const [ viewCategoryId, setViewCategoryId ] = useState(null);
    const [ viewCategoryName, setViewCategoryName ] = useState(null);
  const [userHistoryHasAnyCapsules, setUserHistoryHasAnyCapsules] =
    useState(false);
  const { categoryHistorySizes } = useStatsSortingFunctions({
    listData: listData,
  });

  useEffect(() => {
    if (listData) {
      let categories = categoryHistorySizes();

      setUserHistorySortedList(categories.sortedList);
      setUserHistoryHasAnyCapsules(categories.hasAnyCapsules);
    }
  }, [listData]);

  const handleCategoryPress = (categoryId, categoryName) => {
    setViewCategoryId(categoryId);
    setViewCategoryName(categoryName);
    // handleGetCategoryCapsules(categoryId);
    setHistoryModalVisible(true);
    console.log(`category ${categoryId} -- ${categoryName} pressed!`);
  };

  //   useFocusEffect(
  //     useCallback(() => {
  //       if (!userStats || userStats?.length < 1) {
  //         return;
  //       }

  //       let categories = categoryHistorySizes();
  //         console.log(categories);
  //       setUserHistorySortedList(categories.sortedList);
  //     }, [])
  //   );
  return (
    <>
      {userHistorySortedList && userHistoryHasAnyCapsules && (
        <View
          style={{
            marginHorizontal: 10,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Pie
            data={userHistorySortedList}
            widthAndHeight={radius * 2}
            labelSize={5}
            onSectionPress={handleCategoryPress}
          />
          <View style={{}}>
            <Text
              style={[
                themeStyles.primaryText,
                { fontWeight: "bold", fontSize: 13 },
              ]}
            >
              All friends
            </Text>
          </View>
        </View>
      )}
            {historyModalVisible && viewCategoryId && viewCategoryName && (
        <View>
          <CategoryHistoryModal
            isVisible={historyModalVisible}
            closeModal={() => setHistoryModalVisible(false)}
            categoryId={viewCategoryId}
            title={viewCategoryName}
          />
        </View>
      )}
    </>
  );
};

export default UserCategoryHistoryChart;
