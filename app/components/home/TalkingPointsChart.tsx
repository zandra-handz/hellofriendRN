import { View, Text, Pressable } from "react-native";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
// import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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

  const [showHistory, setShowHistory] = useState(false);

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

  const HEIGHT = 420;
  const PADDING = 20;

  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 20;
  const CHART_OUTER_STROKE_WIDTH = 26;
  const GAP = 0.03;

  const LABELS_SIZE = 11;
  const LABELS_DISTANCE_FROM_CENTER = -50;
  const LABELS_SLICE_END = 5;
  const CENTER_TEXT_SIZE = 40;

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

  const handleMomentScreenNoScroll = () => {
    console.log("handlemomentscreen pressed");

    navigation.navigate("Moments", { scrollTo: null });
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
          // manualGradientColors.lightColor,
          themeAheadOfLoading.lightColor,
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
  }, [userCategories, themeAheadOfLoading]);

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
    <>
      <Pressable
        onPress={() => setShowHistory((prev) => !prev)}
        style={{
          height: 30,
          paddingHorizontal: PADDING,
          position: "absolute",
          zIndex: 20000,
          elevation: 20000,
          top: 370,
          right: 0,
          alignItems: 'center',
          width: "100%",
          flexDirection: 'row',
        }}
      >
        <Ionicons
          name={!showHistory ? "pie-chart" : 'close'}
          size={30}
          color={themeStyles.primaryText.color}
        />
        {!showHistory && (
          
        <Text style={[themeStyles.primaryText, {fontFamily: 'Poppins-Regular', fontSize: 13}]}>
          {"   "}category history
        </Text>
        
        )}
      </Pressable>
      <View
        style={[
          {
            overflow: "hidden",
            height: !showHistory ? HEIGHT : HEIGHT + (SMALL_CHART_RADIUS * 2 + SMALL_CHART_BORDER * 2),
            flexGrow: 1,
            flex: 1,
            padding: PADDING,
            paddingBottom: !showHistory ? PADDING : 0,
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
           // marginBottom: outerPadding,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {/* <MaterialCommunityIcons
            // name="comment-edit-outline"
            //  name="heart-multiple-outline"
            name="head-heart"
            // name="heart-flash"
            // name="graph"
            size={20}
            color={themeStyles.primaryText.color}
            style={{ marginBottom: 0 }}
          /> */}
            {/* <Text
            style={[
              themeStyles.primaryText,
              {
                marginLeft: 6,
                marginRight: 12,
                fontWeight: "bold",
              },
            ]}
          > */}
            <Text
              style={[
                {
                  fontFamily: "Poppins-Bold",
                  fontSize: appFontStyles.subWelcomeText.fontSize + 3,

                  color: themeStyles.primaryText.color,
                  opacity: 0.9,
                  // color: manualGradientColors.homeDarkColor,
                },
              ]}
            >
              Ideas
            </Text>
          </View>
        </View>
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
            onCenterPress={handleMomentScreenNoScroll}
            onPlusPress={() => navigation.navigate("MomentFocus")}
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

        {showHistory && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
             // backgroundColor: themeStyles.primaryBackground.backgroundColor,
              width: "100%",
              bottom:0,
              // backgroundColor: 'teal',
              height: SMALL_CHART_RADIUS * 2 + SMALL_CHART_BORDER * 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,

                justifyContent: "flex-start",
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  { alignSelf: "center" },
                ]}
              >
                History{"  "}
              </Text>
              <FriendHistorySmallChart
                chartBorder={SMALL_CHART_BORDER}
                chartBorderColor={themeStyles.primaryBackground.backgroundColor}
                showLabels={false}
                chartRadius={SMALL_CHART_RADIUS}
              />
            </View>
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.subWelcomeText,
                { alignSelf: "center" },
              ]}
            >
              All time{"  "}
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
        )}

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
    </>
  );
};

export default TalkingPointsChart;
