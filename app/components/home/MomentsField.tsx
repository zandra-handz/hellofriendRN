import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useCallback, useRef, useMemo } from "react";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useIsFocused } from "@react-navigation/native";

import { useCapsuleList } from "@/src/context/CapsuleListContext";
import DotsPositionLayer from "../headers/DotsPositionLayer";
import { useCapsuleColors } from "@/src/context/useCapsuleColors";
// import { generateGradientColors } from "@/src/hooks/GradientColorsUril";

type Props = {
  userId: number;
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const MomentsField = ({
  canvasKey,
  friendColor,
  categoryColors,
  textColor,
  friendId,
  skiaFontSmall,
  darkerOverlayBackgroundColor,
  handleToggleColoredDots,
  coloredDotsModeValue,
  canvasHeight,
  heightFull,
  handleMomentScreenNoScroll,
  handleNavigateToGecko,
}: Props) => {
  const { capsuleList, categorySizes, capsuleChartData } = useCapsuleList();

  const colors = useCapsuleColors(categoryColors);
 

  const capsuleListCount = capsuleList?.length;


//   const prevCategoryColors = useRef(categoryColors);
// if (prevCategoryColors.current !== categoryColors) {
//   console.log('categoryColors CHANGED');
//   prevCategoryColors.current = categoryColors;
// }

  const { navigateToMomentView } = useAppNavigations();

  const HEIGHT = 408;
  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 4;
  const CHART_OUTER_STROKE_WIDTH = 7;
  // const GAP = 0.0;
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
    [navigateToMomentView, categorySizes.categoryStartIndices],
  );

  // const handleMomentScreenNoScroll = useCallback(() => {
  //   navigateToMoments({ scrollTo: null });
  // }, [navigateToMoments]);

  // const memoizedCatLabels = useMemo(
  //   () => categorySizes.catLabels,
  //   [categorySizes.catLabels],
  // );

  // const memoizedCatDecimals = useMemo(d
  //   () => categorySizes.catDecimals,
  //   [categorySizes.catDecimals],
  // );

  const isFocused = useIsFocused();

  return (
    <>
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
          {isFocused && colors?.colors?.length > 0 && (
            <DotsPositionLayer
              canvasKey={canvasKey}
              friendId={friendId}
              iconColor={friendColor}
              smallFont={skiaFontSmall}
              catLabels={categorySizes.catLabels}
              catDecimals={categorySizes.catDecimals}
              canvasHeight={canvasHeight}
              heightFull={heightFull}
              onCategoryPress={handleMomentViewScrollTo}
              onCenterPress={handleMomentScreenNoScroll}
              onCenterSinglePress={handleNavigateToGecko}
              totalJS={capsuleListCount}
              radius={CHART_RADIUS}
              strokeWidth={CHART_STROKE_WIDTH}
              outerStrokeWidth={CHART_OUTER_STROKE_WIDTH}
              // gap={GAP}
              labelsSize={LABELS_SIZE}
              labelsDistanceFromCenter={LABELS_DISTANCE_FROM_CENTER}
              labelsSliceEnd={LABELS_SLICE_END}
              color={textColor}
              darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
              data={capsuleChartData}
              colors={colors.colors}
              colorsReversed={colors.colorsReversed}
              handleToggleColoredDots={handleToggleColoredDots}
              coloredDotsModeValue={coloredDotsModeValue}

              // centerTextSize={CENTER_TEXT_SIZE}
            />
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
    zIndex: 100000,
    //  paddingVertical: 20,
    // borderRadius: 20,
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
});

export default React.memo(MomentsField);
