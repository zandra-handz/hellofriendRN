import { View, Text, Pressable, StyleSheet } from "react-native";
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react"; 
import { AppFontStyles } from "@/app/styles/AppFonts";

import Donut from "../headers/Donut";
import { AppState, AppStateStatus } from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useIsFocused } from "@react-navigation/native";
import { useCategories } from "@/src/context/CategoriesContext";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const TalkingPointsChart = ({
  friendStyle,
  capsuleListCount,
  categoryStartIndices,
  categorySizes,
  generateGradientColors,
  isLoading, // loadingDash
 
  primaryColor, 
  primaryOverlayColor,
  darkerOverlayBackgroundColor,
 
}: Props) => { 
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const { userCategories } = useCategories();
  const isFocused = useIsFocused();

  const {
    navigateToMoments,
    navigateToMomentView,
    navigateToMomentFocus,
    navigateToHistory,
  } = useAppNavigations();
  const [categoryColors, setCategoryColors] = useState<string[]>([]);

  const categories = categorySizes();

  const appState = useRef(AppState.currentState);

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
          if (!capsuleListCount || capsuleListCount < 1) {
            return;
          }
          setTempCategoriesSortedList(categories.sortedList);
        }

        appState.current = nextState;
      }
    );

    return () => subscription.remove(); // cleanup
  }, [capsuleListCount]);

  const HEIGHT = 420;

  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 4;
  const CHART_OUTER_STROKE_WIDTH = 7;

  const GAP = 0.01;

  const LABELS_SIZE = 11;
  const LABELS_DISTANCE_FROM_CENTER = -10;
  const LABELS_SLICE_END = 10;
  const CENTER_TEXT_SIZE = 34;

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

  // useEffect(
  //   useCallback(() => {
  //     if (!capsuleListCount || capsuleListCount < 1) {
  //       return;
  //     }

  //     if (
  //       JSON.stringify(categories.sortedList) !==
  //       JSON.stringify(tempCategoriesSortedList)
  //     ) {
  //       setTempCategoriesSortedList(categories.sortedList);
  //     }
  //   }, [capsuleListCount, categories])
  // );

  useEffect(() => {
    if (!capsuleListCount || capsuleListCount < 1) return;

    if (
      JSON.stringify(categories.sortedList) !==
      JSON.stringify(tempCategoriesSortedList)
    ) {
      setTempCategoriesSortedList(categories.sortedList);
    }
  }, [capsuleListCount, categories]);

  useEffect(() => {
    if (userCategories && userCategories.length > 0) {
      setCategoryColors(
        generateGradientColors(
          userCategories,
          friendStyle.lightColor,
          friendStyle.darkColor
        )
      );
    }
  }, [userCategories, friendStyle]);

  const colors = useMemo(() => {
    if (
      !categoryColors ||
      !categories?.sortedList ||
      categories?.sortedList.length < 1
    )
      return [];

    const userCategorySet = new Set(
      categories.sortedList.map((item) => item.user_category)
    );
    return categoryColors
      .filter((item) => userCategorySet.has(item.user_category))
      .map((item) => item.color);
  }, [categoryColors, categories]);

  return (
    <>
      <>
        {!isLoading && (
          <Pressable
            onPress={navigateToHistory}
            style={styles.historyContainer}
          >
            <SvgIcon name={"pie_chart"} size={30} color={primaryColor} />
            <Text
              style={[
                styles.historyLabelWrapper,
                {
                  color: primaryColor,
                },
              ]}
            >
              {"   "}history
            </Text>
          </Pressable>
        )}
        <View
          style={[
            styles.container,
            {
              height: HEIGHT,
              minHeight: HEIGHT,
              backgroundColor: primaryOverlayColor,
            },
          ]}
        >
          {/* {isLoading && (
            <LoadingBlock
            loading={true}
            />
          )} */}

          {!isLoading && (
            <>
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    {
                      // fontFamily: "Poppins-Bold",
                      fontSize: subWelcomeTextStyle.fontSize + 3,

                      color: primaryColor,
                      opacity: 0.9,
                    },
                  ]}
                >
                  Ideas
                </Text>
              </View>

              {isFocused && (
                <View style={styles.donutWrapper}>
                  <Donut
                    friendStyle={friendStyle}
                    primaryColor={primaryColor}
                    darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                    onCategoryPress={handleMomentViewScrollTo}
                    onCenterPress={handleMomentScreenNoScroll}
                    onPlusPress={handleNavigateToCreateNew}
                    totalJS={capsuleListCount}
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
              )}
            </>
          )}
        </View>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexGrow: 1,
    flex: 1,
    padding: 20, // PADDING
    paddingBottom: 20,
    borderRadius: 20,
  },
  historyContainer: {
    height: 30,
    paddingHorizontal: 20, // PADDING
    position: "absolute",
    zIndex: 20000,
    elevation: 20000,
    top: 370,
    right: 0,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },
  labelContainer: {
    borderRadius: 20,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyLabelWrapper: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
  },
  donutWrapper: {},
});

export default TalkingPointsChart;
