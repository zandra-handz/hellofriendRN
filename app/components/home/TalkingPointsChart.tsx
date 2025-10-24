import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useEffect } from "react";
import { AppFontStyles } from "@/app/styles/AppFonts";

import Donut from "../headers/Donut";
// import { AppState, AppStateStatus } from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useIsFocused } from "@react-navigation/native";
import { useCategories } from "@/src/context/CategoriesContext";
import SvgIcon from "@/app/styles/SvgIcons";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import { useLDTheme } from "@/src/context/LDThemeContext";
import { generateGradientColors } from "@/src/hooks/GradientColorsUril";

type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const TalkingPointsChart = ({
  themeColors,

  skiaFontLarge,
  skiaFontSmall,
}: Props) => {
  console.log("TALKING POINTS COMP RERENDERED");

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const { userCategories } = useCategories();

  const { lightDarkTheme } = useLDTheme();

  const primaryColor = lightDarkTheme.primaryText;
  const primaryOverlayColor = lightDarkTheme.primaryOverlayColor; 
  const { capsuleList, categorySizes, isPending } = useCapsuleList();

  const capsuleListCount = capsuleList?.length;

  const categoryIds = useMemo(
    () => userCategories.map((c) => c.id), // or c.category_id
    [userCategories]
  );

  const categoryColors = useMemo(() => {
    if (!categoryIds.length || !themeColors?.lightColor) return [];

    return generateGradientColors(
      categoryIds, // now only IDs
      themeColors.lightColor,
      themeColors.darkColor
    );
  }, [categoryIds, themeColors?.lightColor, themeColors?.darkColor]);

  const categories = categorySizes;

  const colors = useMemo(() => {
    console.log("colors usememo");
    if (
      !categories?.sortedList ||
      categories.sortedList.length === 0 ||
      isPending
    ) {
      console.log("colors usememo returning null");
      return { colors: [], colorsReversed: [], friend: null }; // consistent shape
    }
    const userCategorySet = new Set(
      categories?.sortedList.map((item) => item.user_category)
    );

    const filteredColors = categoryColors
      .filter((item) => userCategorySet.has(item.user_category))
      .map((item) => item.color);

    // only works if categoryColors has a `friend` field; otherwise remove this line
    const friend = categoryColors[0].friend ?? null;
    const colorsReversed = filteredColors.slice().reverse();
    return { colors: filteredColors, colorsReversed: colorsReversed, friend };
  }, [categoryColors, categories?.sortedList, isPending]);

 

  const {
    navigateToMoments,
    navigateToMomentView,
    navigateToMomentFocus,
    navigateToHistory,
  } = useAppNavigations();
  // const [categoryColors, setCategoryColors] = useState<string[]>([]);

  // const appState = useRef(AppState.currentState);

  const HEIGHT = 420;
  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 4;
  const CHART_OUTER_STROKE_WIDTH = 7;
  const GAP = 0.01;
  const LABELS_SIZE = 12;
  const LABELS_DISTANCE_FROM_CENTER = 4;
  const LABELS_SLICE_END = 20;

  const handleMomentViewScrollTo = useCallback(
    (categoryLabel) => {
      if (categoryLabel && categorySizes.categoryStartIndices) {
        navigateToMomentView({
          index: categorySizes.categoryStartIndices[categoryLabel],
        });
      }
    },
    [navigateToMomentView, categorySizes.categoryStartIndices]
  );

  const handleMomentScreenNoScroll = useCallback(() => {
    navigateToMoments({ scrollTo: null });
  }, [navigateToMoments]);

  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1 });
  }, [navigateToMomentFocus]);

  const memoizedData = useMemo(
    () => categories.sortedList,
    [categories.sortedList]
  );
  const memoizedColors = useMemo(() => colors?.colors, [colors?.colors]);
  const memoizedColorsReversed = useMemo(
    () => colors?.colorsReversed,
    [colors?.colorsReversed]
  );

  const isFocused = useIsFocused();

  return (
    <>
      <Pressable onPress={navigateToHistory} style={styles.historyContainer}>
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
        <>
          <View style={styles.labelContainer}>
            <Text
              style={[
                {
                  fontSize: subWelcomeTextStyle.fontSize + 3,

                  color: primaryColor,
                  opacity: 0.9,
                },
              ]}
            >
              Ideas
            </Text>
          </View>

          {isFocused && colors?.colors?.length > 0 && (
            <View style={styles.donutWrapper}>
              <Donut
                font={skiaFontLarge}
                smallFont={skiaFontSmall}
                themeColors={themeColors}
                iconColor={themeColors.lightColor}
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
                // data={[...categories.sortedList]} // new array reference every render
                // colors={[...colors?.colors]}
                // colorsReversed={[...colors?.colorsReversed]}

                data={memoizedData}
                colors={memoizedColors}
                colorsReversed={memoizedColorsReversed}
                // centerTextSize={CENTER_TEXT_SIZE}
              />
            </View>
          )}
        </>
      </View>
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

export default React.memo(TalkingPointsChart);
