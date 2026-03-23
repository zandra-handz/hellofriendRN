import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { useFriendCategoryColors } from "@/src/context/FriendCategoryColorsContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import DotsPositionLayer from "../headers/DotsPositionLayer";
import { useCapsuleColors } from "@/src/context/useCapsuleColors";

type Props = {
  userId: number;
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const MomentsField = ({
  canvasKey,
  friendColor,
  textColor,
  friendId,
  skiaFontSmall,
  darkerOverlayBackgroundColor,
  handleToggleColoredDots,
  coloredDotsModeValue,
  canvasHeight,
  heightFull,
  handleNavigateToGecko,
  handleNavToMoments,
}: Props) => {
  const { capsuleList, categorySizes, capsuleChartData } = useCapsuleList();

  const { friendCategoryColors } = useFriendCategoryColors();
  const colors = useCapsuleColors(friendCategoryColors);

  const capsuleListCount = capsuleList?.length;

  const handleCenterPress = () => {
    console.log("disabled nav function in MomentsField");
  };

  const HEIGHT = 408;
  const CHART_RADIUS = 150;
  const CHART_STROKE_WIDTH = 4;
  const CHART_OUTER_STROKE_WIDTH = 7;
  const LABELS_SIZE = 12;
  const LABELS_DISTANCE_FROM_CENTER = 4;
  const LABELS_SLICE_END = 20;

  const handleMomentViewScrollTo = useCallback(
    (categoryLabel) => {
      if (categoryLabel && categorySizes.categoryStartIndices) {
        handleNavToMoments(categoryLabel);
      }
    },
    [handleNavToMoments, categorySizes.categoryStartIndices],
  );

  const categoryColorMapValue = useSharedValue<Record<number, string>>({});
  const prevFriendId = useRef(friendId);

  useEffect(() => {
    if (prevFriendId.current !== friendId) {
      categoryColorMapValue.value = {};
      prevFriendId.current = friendId;
    }
  }, [friendId]);

  useEffect(() => {
    if (!friendId) return;
    if (!categorySizes.catLabels?.length || !colors.categoryColorsMap || !Object.keys(colors.categoryColorsMap).length) return;

    const map: Record<number, string> = {};
    categorySizes.catLabels.forEach((item) => {
      map[item.user_category] = colors.categoryColorsMap[item.user_category] ?? colors.colors?.[0];
    });
    categoryColorMapValue.value = map;
  }, [friendId, categorySizes.catLabels, colors.categoryColorsMap]);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            height: HEIGHT,
          },
        ]}
      >
        <>
          {colors?.colors?.length > 0 && (
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
              onCenterPress={handleToggleColoredDots}
              onCenterSinglePress={handleToggleColoredDots}
              totalJS={capsuleListCount}
              radius={CHART_RADIUS}
              strokeWidth={CHART_STROKE_WIDTH}
              outerStrokeWidth={CHART_OUTER_STROKE_WIDTH}
              labelsSize={LABELS_SIZE}
              labelsDistanceFromCenter={LABELS_DISTANCE_FROM_CENTER}
              labelsSliceEnd={LABELS_SLICE_END}
              color={textColor}
              darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
              data={capsuleChartData}
              colors={colors.colors} 
              coloredDotsModeValue={coloredDotsModeValue}
              categoryColorMapValue={categoryColorMapValue}
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
    padding: 10,
    zIndex: 100000,
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