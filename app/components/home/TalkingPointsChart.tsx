import { View, Text } from "react-native";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
// import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Donut from "../headers/Donut";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { AppState, AppStateStatus } from "react-native";
import FriendHistorySmallChart from "./FriendHistorySmallChart";
import UserHistorySmallChart from "./UserHistorySmallChart";
import { useFriendList } from "@/src/context/FriendListContext";

import CategoryDetailsModal from "../headers/CategoryDetailsModal";

// import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";

import { useCategories } from "@/src/context/CategoriesContext";
// import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";

type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const TalkingPointsChart = ({ selectedFriend, outerPadding }: Props) => {
  const { themeStyles, manualGradientColors, appFontStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { capsuleList } = useCapsuleList();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { themeAheadOfLoading } = useFriendList();
  const [categoryColors, setCategoryColors] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const { userCategories } = useCategories();

  const appState = useRef(AppState.currentState);
  const SMALL_CHART_RADIUS = 30;
  const SMALL_CHART_BORDER = 3;

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        console.log("App state changed:", nextState);

        if (
          appState.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          console.log("App has come to the foreground!");
          if (!capsuleList || capsuleList?.length < 1) {
            return;
          }

          let categories = categorySizes();
          setTempCategoriesSortedList(categories.sortedList);
        }

        appState.current = nextState;
      }
    );

    return () => subscription.remove(); // cleanup
  }, [capsuleList]);

  const { categorySizes, generateGradientColors, generateRandomColors } =
    useMomentSortingFunctions({
      listData: capsuleList,
    });

  const HEIGHT = 430;

  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 20;
  const CHART_OUTER_STROKE_WIDTH = 26;
  const GAP = 0.03;

  const LABELS_SIZE = 14;
  const LABELS_DISTANCE_FROM_CENTER = -56;
  const LABELS_SLICE_END = 4;
  const CENTER_TEXT_SIZE = 50;

  const [tempCategoriesSortedList, setTempCategoriesSortedList] = useState([]);

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
    navigation.navigate("Moments", { scrollTo: categoryId });
  };

  useFocusEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      }

      let categories = categorySizes();
      setTempCategoriesSortedList(categories.sortedList);
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
          paddingTop: 20,
          paddingBottom: 0,
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
          height: "74%",
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
      </View>
      <View
        style={{
          flexDirection: "row", 
          justifyContent: "space-between",
          // backgroundColor: themeStyles.primaryBackground.backgroundColor,
          width: "100%",
          // backgroundColor: 'teal',
          height: (SMALL_CHART_RADIUS * 2) + (SMALL_CHART_BORDER * 2),
          
        }}
      >
        <View
          style={{
            flexDirection: "row", 
            flex: 1, 
            
            justifyContent: "flex-start",
          }}
        >
          <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText, {alignSelf: 'center'}]}>
            History{'  '}
          </Text>
          <FriendHistorySmallChart
          chartBorder={SMALL_CHART_BORDER}
            chartBorderColor={themeStyles.primaryBackground.backgroundColor}
            showLabels={false}
            chartRadius={SMALL_CHART_RADIUS}
          />
        </View>
     <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText, {alignSelf: 'center'}]}>
            All time{'  '}
          </Text>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <UserHistorySmallChart
           chartBorder={SMALL_CHART_BORDER}
           chartBorderColor={themeStyles.primaryBackground.backgroundColor}
            showLabels={false}
            chartRadius={SMALL_CHART_RADIUS}
          />
        </View>
      </View>
      {/* <View style={{ width: "100%", height: 10 }}></View> */}
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
