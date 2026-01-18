import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useRef  } from "react";
import { AppFontStyles } from "@/app/styles/AppFonts";

import Donut from "../headers/Donut";
// import { AppState, AppStateStatus } from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useIsFocused } from "@react-navigation/native";
// import { useCategories } from "@/src/context/CategoriesContext";
import SvgIcon from "@/app/styles/SvgIcons";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
 
// import { generateGradientColors } from "@/src/hooks/GradientColorsUril";

type Props = {
  userId: number;
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const TalkingPointsChart = ({
  themeColors,
  categoryColors,
  textColor,
  overlayColor,
  skiaFontLarge,
  skiaFontSmall,
  darkerOverlayBackgroundColor,
}: Props) => {
  console.log("TALKING POINTS COMP RERENDERED");
// const { userCategories} = useCategories();
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  // const { userCategories } = useCategories();
 
  const { capsuleList, categorySizes, capsuleCategorySet, isPending } =
    useCapsuleList();

  const capsuleListCount = capsuleList?.length;
 


  const colorsRef = useRef<{
    colors: string[];
    colorsReversed: string[];
    friend: any;
  }>({
    colors: [],
    colorsReversed: [],
    friend: null,
  });

  // Only update colorsRef if we have data and are not pending
  if (capsuleCategorySet?.size && !isPending && categoryColors?.length) {
    const filteredColors = categoryColors
      .filter((item) => capsuleCategorySet.has(item.user_category))
      .map((item) => item.color);

    const friend = categoryColors[0]?.friend ?? null;

    colorsRef.current = {
      colors: filteredColors,
      colorsReversed: filteredColors.slice().reverse(),
      friend,
    };
  }

  // Use the persistent value
  const colors = colorsRef.current;

  const { navigateToMoments, navigateToMomentView, navigateToHistory } =
    useAppNavigations();
  // const [categoryColors, setCategoryColors] = useState<string[]>([]);

  // const appState = useRef(AppState.currentState);

  const HEIGHT = 408;
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
 
  const memoizedData = useMemo(
    () => categorySizes.sortedList,
    [categorySizes.sortedList]
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
        <SvgIcon name={"pie_chart"} size={30} color={textColor} />
        <Text
          style={[
            styles.historyLabelWrapper,
            {
              color: textColor,
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
           // backgroundColor: overlayColor,
          },
        ]}
      >
        <>
          <View style={styles.labelContainer}>
            <Text
              style={[
                {
                  fontSize: subWelcomeTextStyle.fontSize + 5,

                  paddingLeft: 10,
                  fontWeight: "bold",
                  color: textColor,
                  opacity: 0.9,
                },
              ]}
            >
              Topics
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
                color={textColor}
                darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}

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
    padding: 10, // PADDING

    paddingVertical: 20,
    borderRadius: 20,
  },
  historyContainer: {
    height: 20,
    paddingHorizontal: 10, // PADDING
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
    height: 26,

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
