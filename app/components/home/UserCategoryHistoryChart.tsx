import { View, Text } from "react-native";
import React, {  useEffect, useState } from "react";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
 
import Pie from "../headers/Pie"; 
import CategoryHistoryModal from "../headers/CategoryHistoryModal";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  radius: number;
  labelsSize: number;
  onLongPress: () => void;
};

const UserCategoryHistoryChart = ({ listData, radius = 80, labelsSize=9, onLongPress }: Props) => {
  // console.log(`listdata in usercategoryhistory chart`, listData);
  const [userHistorySortedList, setUserHistorySortedList] = useState([]);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle(); 
  const [ viewCategoryId, setViewCategoryId ] = useState(null);
    const [ viewCategoryName, setViewCategoryName ] = useState(null);
  const [userHistoryHasAnyCapsules, setUserHistoryHasAnyCapsules] =
    useState(false);
  const { categoryHistorySizes } = useStatsSortingFunctions({
    listData: listData,
  });

  useEffect(() => {
    if (listData) {
      //  console.log(`LIST DATA`, listData);
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
            onLongSectionPress={onLongPress}
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
