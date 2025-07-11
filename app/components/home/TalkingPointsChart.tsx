import { View, Text } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Donut from "../headers/Donut";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { ScrollView } from "react-native-gesture-handler";
import { useFriendList } from "@/src/context/FriendListContext";
import Pie from "../headers/Pie";
import CategoryDetailsModal from "../headers/CategoryDetailsModal";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useUserStats } from "@/src/context/UserStatsContext";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
import UserCategoryHistoryChart from "./UserCategoryHistoryChart";
type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const TalkingPointsChart = ({ selectedFriend, outerPadding }: Props) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();
  const { stats } = useUserStats();
  const { capsuleList,categoryStartIndices } = useCapsuleList();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { themeAheadOfLoading } = useFriendList();
  const [categoryColors, setCategoryColors] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const {
    userCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    createNewCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useUserSettings();

  const { selectedFriendStats } = useSelectedFriendStats();

  const { categorySizes, generateGradientColors, generateRandomColors } =
    useMomentSortingFunctions({
      listData: capsuleList,
    });

  const { categoryHistorySizes } = useStatsSortingFunctions({
    listData: selectedFriendStats,
  });

  const HEIGHT = 370;

  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 20;
  const CHART_OUTER_STROKE_WIDTH = 26;
  const GAP = 0.03;

  const LABELS_SIZE = 14;
  const LABELS_DISTANCE_FROM_CENTER = -56;
  const LABELS_SLICE_END = 4;
  const CENTER_TEXT_SIZE = 50;

  const [categoriesMap, setCategoriesMap] = useState({});
  const [categoriesSortedList, setCategoriesSortedList] = useState([]);
  const [tempCategoriesSortedList, setTempCategoriesSortedList] = useState([]);
  const [tempCategoriesMap, setTempCategoriesMap] = useState({});

  const [viewCategoryId, setViewCategoryId] = useState(null);

  const handleSetCategoryDetailsModal = (categoryId) => {
    if (!categoryId) {
      return;
    }
    setViewCategoryId(categoryId);
    setDetailsModalVisible(true);
  };


    const handleMomentScreenScrollTo = (categoryId) => {
    if (!categoryId) {
      return;
    }
    navigation.navigate('Moments', {scrollTo: categoryId})
  };


  // useEffect(() => {
  //   if (selectedFriendStats){
  //     console.log('~~~~~~~~~SELECTED FRIEND STATS!', selectedFriendStats);
  //   }

  // }, [selectedFriendStats]);

  const [friendHistorySortedList, setFriendHistorySortedList] = useState([]);
  const [friendHistoryHasAnyCapsules, setFriendHistoryHasAnyCapsules] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!selectedFriendStats || selectedFriendStats?.length < 1) {
        return;
      }

      let categories = categoryHistorySizes();
      //  console.log(categories);
      setFriendHistorySortedList(categories.sortedList);
      setFriendHistoryHasAnyCapsules(categories.hasAnyCapsules);
    }, [selectedFriendStats])
  );

  useFocusEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      }

      let categories = categorySizes();
      //  console.log(categories);
      setCategoriesMap(categories.lookupMap);
      setCategoriesSortedList(categories.sortedList);
      setTempCategoriesSortedList(categories.sortedList);
      setTempCategoriesMap(categories.lookupMap);
    }, [capsuleList])
  );

  useEffect(() => {
    if (userCategories && userCategories.length > 0) {
      setCategoryColors(
        generateGradientColors(
          userCategories,
          manualGradientColors.lightColor,
          // themeAheadOfLoading.darkColor,
          //  manualGradientColors.homeDarkColor
          themeAheadOfLoading.darkColor
        )
      );
      //         setCategoryColors(
      //     generateRandomColors(
      //       userCategories
      //     )
      //   );
    }
  }, [userCategories]);

  useEffect(() => {
    if (categoryColors && tempCategoriesSortedList) {
      const userCategorySet = new Set(
        tempCategoriesSortedList.map((item) => item.user_category)
      );

      const filteredColors = categoryColors
        .filter((item) => userCategorySet.has(item.user_category))
        .map((item) => item.color);
      setColors(filteredColors);
    }
  }, [categoryColors, tempCategoriesSortedList]);

  return (
    <View
      style={[
        {
          overflow: "hidden",
          height: HEIGHT,
          padding: 10,
          paddingBottom: 10,
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          borderRadius: 20,
        },
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",

          // backgroundColor: 'orange',
          marginBottom: outerPadding,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            // name="comment-edit-outline"
            //  name="heart-multiple-outline"
            name="head-heart"
            // name="heart-flash"
            // name="graph"
            size={20}
            color={themeStyles.primaryText.color}
            style={{ marginBottom: 0 }}
          />
          <Text
            style={[
              themeStyles.primaryText,
              {
                marginLeft: 6,
                marginRight: 12,
                fontWeight: "bold",
              },
            ]}
          >
            Talking Points Ready
          </Text>
        </View>
        {/* <LabeledArrowButton
          color={themeStyles.primaryText.color}
          label="View"
          opacity={0.7}
          onPress={() => navigation.navigate("Helloes")}
        /> */}
      </View>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
      <View
        style={{
          marginHorizontal: 10,
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Donut
          onCategoryPress={handleMomentScreenScrollTo}
          onCategoryLongPress={handleSetCategoryDetailsModal}
          onCenterPress={() => navigation.navigate("MomentFocus")}
          radius={CHART_RADIUS}
          strokeWidth={CHART_STROKE_WIDTH}
          outerStrokeWidth={CHART_OUTER_STROKE_WIDTH}
          gap={GAP}
          labelsSize={LABELS_SIZE}
          labelsDistanceFromCenter={LABELS_DISTANCE_FROM_CENTER}
          labelsSliceEnd={LABELS_SLICE_END}
          data={tempCategoriesSortedList}
          colors={colors}
          centerTextSize={CENTER_TEXT_SIZE}
        />
        {/* <View style={{  }}>
            <Text
            onPress={() => navigation.navigate('MomentFocus')}
              style={[
                themeStyles.primaryText,
                { fontWeight: 'bold', fontSize: 13 },
              ]}
            >
              Loaded
            </Text>
          </View> */}
      </View>

      {/* </ScrollView> */}

      <View style={{ width: "100%", height: 10 }}></View>
      {detailsModalVisible && (
        <View>
          <CategoryDetailsModal
            isVisible={detailsModalVisible}
            closeModal={() => setDetailsModalVisible(false)}
            categoryId={viewCategoryId}
          />
        </View>
      )}
    </View>
  );
};

export default TalkingPointsChart;
