import { View, Text, Pressable } from "react-native";
import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
// import LabeledArrowButton from "../appwide/button/LabeledArrowButton";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import {  Ionicons } from "@expo/vector-icons";
import Donut from "../headers/Donut";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { AppState, AppStateStatus } from "react-native";
import FriendHistoryPieDataWrap from "./FriendHistoryPieDataWrap";
import UserHistoryPieDataWrap from "./UserHistoryPieDataWrap";
import { useFriendList } from "@/src/context/FriendListContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import Demo from "../headers/SkiaDemo";
import { useCategories } from "@/src/context/CategoriesContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";

type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const TalkingPointsChart = ({ outerPadding }: Props) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
 
  const { navigateToMoments, navigateToMomentView, navigateToMomentFocus } = useAppNavigations();
  const { capsuleList } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const [categoryColors, setCategoryColors] = useState<string[]>([]);
  
  const {   categoryStartIndices } = useTalkingPCategorySorting({
    listData: capsuleList,
  }); 
  const { userCategories } = useCategories();

  const [showHistory, setShowHistory] = useState(false);
  const { categorySizes, generateGradientColors } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const categories = categorySizes();
 
  const toggleShowHistory = useCallback(() => {
  setShowHistory(prev => !prev);
}, []);

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

          // let categories = categorySizes();
          setTempCategoriesSortedList(categories.sortedList);
        }

        appState.current = nextState;
      }
    );

    return () => subscription.remove(); // cleanup
  }, [capsuleList]);



  const HEIGHT = 420;
  const PADDING = 20;

  const CHART_RADIUS = 150;
  // const CHART_STROKE_WIDTH = 20;
  // const CHART_OUTER_STROKE_WIDTH = 26;
    const CHART_STROKE_WIDTH = 4;
  const CHART_OUTER_STROKE_WIDTH = 7;
  // const GAP = 0.03;
    const GAP = 0.01;

  const LABELS_SIZE = 11;
  const LABELS_DISTANCE_FROM_CENTER = -10;
  const LABELS_SLICE_END = 10;
  const CENTER_TEXT_SIZE = 40;

  const [tempCategoriesSortedList, setTempCategoriesSortedList] = useState([]);

 

    const handleMomentViewScrollTo = useCallback(
    (categoryLabel) => {
      if (categoryLabel && categoryStartIndices) {
 
        navigateToMomentView({ index: categoryStartIndices[categoryLabel] });
      }
    },
    [navigateToMomentView, categoryStartIndices]
  );

  const handleMomentScreenNoScroll = useCallback(() => {
    navigateToMoments({ scrollTo: null });
  }, [navigateToMoments]);

  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1 });
  }, [navigateToMomentFocus]);

  useEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      } 

      // let categories = categorySizes();
      // setTempCategoriesSortedList(categories.sortedList);
      if (
        JSON.stringify(categories.sortedList) !==
        JSON.stringify(tempCategoriesSortedList)
      ) {
        setTempCategoriesSortedList(categories.sortedList);
      }
    }, [capsuleList, categories])
  );

  useEffect(() => {
    if (userCategories && userCategories.length > 0) {
      setCategoryColors(
        generateGradientColors(
          userCategories,
          themeAheadOfLoading.lightColor,
          themeAheadOfLoading.darkColor
        )
      );
    }
  }, [userCategories, themeAheadOfLoading]);

 


  const colors = useMemo(() => {
  if (!categoryColors || !categories?.sortedList || categories?.sortedList.length < 1) return [];
 
 
  const userCategorySet = new Set(categories.sortedList.map(item => item.user_category));
  return categoryColors
    .filter(item => userCategorySet.has(item.user_category))
    .map(item => item.color);
}, [categoryColors, categories]);

  return (
    <>
    {/* <View style={{width: '100%', height: 100, }}>
      
    <Demo />
    
    </View> */}
      <Pressable
        onPress={toggleShowHistory}
        style={{
          height: 30,
          paddingHorizontal: PADDING,
          position: "absolute",
          zIndex: 20000,
          elevation: 20000,
          top: 370,
          right: 0,
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <Ionicons
          name={!showHistory ? "pie-chart" : "close"}
          size={30}
          color={themeStyles.primaryText.color}
        />
        {!showHistory && (
          <Text
            style={[
              themeStyles.primaryText,
              { fontFamily: "Poppins-Regular", fontSize: 13 },
            ]}
          >
            {"   "}category history
          </Text>
        )}
      </Pressable>
      <View
        style={[
          {
            overflow: "hidden",
            height: !showHistory
              ? HEIGHT
              : HEIGHT + (SMALL_CHART_RADIUS * 2 + SMALL_CHART_BORDER * 2),
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
 
          }}
        >
          <View style={{ flexDirection: "row" }}>
  
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
            marginHorizontal: 0,
            alignItems: "center",
            flexDirection: "column",
            height: "74%",
          }}
        >
       
            
          <Donut
            onCategoryPress={handleMomentViewScrollTo} 
            onCenterPress={handleMomentScreenNoScroll}
            onPlusPress={handleNavigateToCreateNew}
            radius={CHART_RADIUS}
            strokeWidth={CHART_STROKE_WIDTH}
            outerStrokeWidth={CHART_OUTER_STROKE_WIDTH}
            gap={GAP}
            labelsSize={LABELS_SIZE}
            labelsDistanceFromCenter={LABELS_DISTANCE_FROM_CENTER}
            labelsSliceEnd={LABELS_SLICE_END}
            data={categories?.sortedList || []}
            colors={colors}
            centerTextSize={CENTER_TEXT_SIZE}
          />
          
        
        </View>

        {showHistory && selectedFriend && !loadingNewFriend && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // backgroundColor: themeStyles.primaryBackground.backgroundColor,
              width: "100%",
              bottom: 0,
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
              <FriendHistoryPieDataWrap
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
              <UserHistoryPieDataWrap
                chartBorder={SMALL_CHART_BORDER}
                chartBorderColor={themeStyles.primaryBackground.backgroundColor}
                showLabels={false}
                chartRadius={SMALL_CHART_RADIUS}
              />
            </View>
          </View>
        )}
 
      </View>
    </>
  );
};

export default TalkingPointsChart;
