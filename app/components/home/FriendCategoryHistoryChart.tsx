import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
import Pie from "../headers/Pie";
import CategoryFriendHistoryModal from "../headers/CategoryFriendHistoryModal";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  friendData: object;
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;

  radius: number;
  labelsSize: number;
  onLongPress: (categoryId: number | null) => void;
  showFooterLabel: boolean;
};

const FriendCategoryHistoryChart = ({
  friendData,
  listData,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
  showLabels = true,
  onLongPress,
  showFooterLabel,
}: Props) => {
  //  console.log(`listdata in friendhistorychart chart`, listData);
  const [friendHistorySortedList, setFriendHistorySortedList] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const [viewCategoryId, setViewCategoryId] = useState(null);
  const [viewCategoryName, setViewCategoryName] = useState(null);
  const [friendHistoryHasAnyCapsules, setFriendHistoryHasAnyCapsules] =
    useState(false);
  const { categoryHistorySizes } = useStatsSortingFunctions({
    listData: listData,
  });

  useEffect(() => {
    if (listData) {
      // console.log(`LIST DATA`, listData);
      let categories = categoryHistorySizes();

      setFriendHistorySortedList(categories.sortedList);
      setFriendHistoryHasAnyCapsules(categories.hasAnyCapsules);
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
      {friendHistorySortedList && friendHistoryHasAnyCapsules && (
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
            data={friendHistorySortedList}
            widthAndHeight={radius * 2}
            labelsSize={labelsSize}
            // onSectionPress={() => console.log("hi!")}
            onSectionPress={handleCategoryPress}
          />
          {showFooterLabel && (
            <View style={{}}>
              <Text
                style={[
                  themeStyles.primaryText,
                  { fontWeight: "bold", fontSize: 13 },
                ]}
              >
                {friendData?.name}
              </Text>
            </View>
          )}
        </View>
      )}
      {historyModalVisible &&
        viewCategoryId &&
        viewCategoryName &&
        friendData && (
          <View>
            <CategoryFriendHistoryModal
              isVisible={historyModalVisible}
              closeModal={() => setHistoryModalVisible(false)}
              categoryId={viewCategoryId}
              categoryName={viewCategoryName}
              friendId={friendData.id}
              title={viewCategoryName}
            />
          </View>
        )}
    </>
  );
};

export default FriendCategoryHistoryChart;
