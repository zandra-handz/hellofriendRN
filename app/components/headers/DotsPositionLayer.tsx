import { View, StyleSheet, DimensionValue } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";

// import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useWindowDimensions } from "react-native";
import DotsCanvas from "./DotsCanvas";
import { calculatePercentage } from "@/src/hooks/GradientColorsUril";

// OUTSIDE the component, module level
const positionsCache = new Map<
  string,
  { x: number; y: number; size: number; color: string; catId: number }[]
>();

const DotsPositionLayer = ({
 
  canvasKey,
  iconColor,
  darkerOverlayBackgroundColor,
  friendId,
  catDecimals,
  catLabels,
  onCategoryPress, 
  onCenterPress,
  onCenterSinglePress,
  totalJS,
  data,
  radius = 40, 
  color,
  colors, 
  canvasHeight,
  heightFull, 
  coloredDotsModeValue,
  categoryColorMapValue,
 

  smallFont,
}) => {
  const [positions, setPositions] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  const { width: screenWidth } = useWindowDimensions();

  const decimalsValue = useSharedValue<number[]>([]);
  const catDecimalsValue = useSharedValue<number[]>([]);
  const labelsValue = useSharedValue<string[]>([]);
  // const categoryStopsValue = useSharedValue<number[]>([]);

  // NEW: category -> color map
  // const categoryColorMapValue = useSharedValue<Record<number, string>>({});
  const categoryIdsValue = useSharedValue<number[]>([]);

  // NEED THIS TO STOP THE 'FLASH' OF OLD SHARED VALUES IN LEAVES WHEN FRIEND CHANGES
  // useFocusEffect(
  //   useCallback(() => {
  //     decimalsValue.value = [];
  //     catDecimalsValue.value = [];
  //     labelsValue.value = [];
  //     setPositions([]);

  //     return () => {
  //       decimalsValue.value = [];
  //       catDecimalsValue.value = [];
  //       labelsValue.value = [];
  //       setPositions([]);
  //     };
  //   }, []),
  // );
  const prevFriendIdRef = useRef(null);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (prevFriendIdRef.current !== friendId) {
  //       console.log('RSETTING POSITIONS')
  //       prevFriendIdRef.current = friendId;
  //       decimalsValue.value = [];
  //       catDecimalsValue.value = [];
  //       labelsValue.value = [];
  //       setPositions([]);
  //     }
  //   }, [friendId]),
  // );

  // useEffect(() => {
  //   if (!catLabels || !colorsReversed) return;
  //   const map: Record<number, string> = {};
  //   catLabels.forEach((item, index) => {
  //     map[item.user_category] = colorsReversed[index] ?? colorsReversed[0];
  //   });
  //   categoryColorMapValue.value = map;
  // }, [catLabels, colorsReversed]);


//   useEffect(() => {
//   if (!catLabels || !colors) return;
//   const map: Record<number, string> = {};
//   catLabels.forEach((item, index) => {
//     map[item.user_category] = colors[index] ?? colors[0];
//   });
//   categoryColorMapValue.value = map;
// }, [catLabels, colors]);

// useEffect(() => {
//   if (!categoryColorsMap || !Object.keys(categoryColorsMap).length) return;
//   categoryColorMapValue.value = categoryColorsMap;
// }, [categoryColorsMap]);

  useEffect(() => {
    if (!data) return;
    categoryIdsValue.value = data.map((d) => d.user_category);
  }, [data]);

  const RADIUS = radius;

  const leafCenterXValue = useSharedValue(screenWidth / 2);
  const leafCenterYValue = useSharedValue(RADIUS);

  useEffect(() => {
    leafCenterXValue.value = screenWidth / 2;
  }, [screenWidth]);

  const setPositionsWithCache = useCallback(
    (arr) => {
      const key = `${friendId}-${totalJS}`;
      if (positionsCache.has(key)) {
        setPositions(positionsCache.get(key)!);
        return;
      }
      positionsCache.set(key, arr);
      setPositions(arr);
    },
    [friendId, totalJS],
  );

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    if (dataCountList.length === 0) return;

    decimalsValue.value = [];
    catDecimalsValue.value = [];
    labelsValue.value = [];

    const total = dataCountList.reduce((acc, item) => acc + item.size, 0); // TOTAL CAPSULES
    const percentages = calculatePercentage(dataCountList, total); // CAPSULE PERCENTAGES
    const decimals = percentages.map((n) => Number(n.toFixed(0)) / 100); // CAPSULE DECIMALS

    // CATEGORY TOTAL, PERCENTANGE, AND DECIMALS IS CALCULATED IN CAPSULE CONTEXT

    decimalsValue.value = [...decimals];
    catDecimalsValue.value = [...catDecimals]; // from context
    labelsValue.value = [...catLabels]; // from context
  }, [data, catDecimals, catLabels, totalJS]);

  // NEED THIS EVEN IF NOT USING THE RETURN
  const leafPositionsCombined = useDerivedValue(() => {
    "worklet";

    const decimals = decimalsValue.value;
    if (!decimals || decimals.length < 1) {
      console.log("worklet returning early");
      // runOnJS(setPositions)([]);
      return [];
    }

    const categoryIds = categoryIdsValue.value;
    const colorMap = categoryColorMapValue.value;

    const centerX = leafCenterXValue.value;
    const centerY = leafCenterYValue.value;
    const rangeX = centerX - 20;
    const rangeY = centerY - 20;

    const arr: {
      x: number;
      y: number;
      size: number;
      color: string;
      catId: number;
    }[] = [];

    const n = decimals.length;

    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const cellW = (rangeX * 2) / cols;
    const cellH = (rangeY * 2) / rows;

    // shuffle indices
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }

    for (let i = 0; i < n; i++) {
      const dataIndex = indices[i];
      const decSize = decimals[dataIndex] ?? 1;

      const minLeafSize = 1;
      const maxLeafSize = 3;
      const scaleFactor = 7 / n;
      const baseSize =
        minLeafSize + decSize * (maxLeafSize - minLeafSize) * scaleFactor;
      const variance = 0.2;

      let finalSize = baseSize * (1 + (Math.random() * 2 - 1) * variance);
      finalSize = Math.min(Math.max(finalSize, minLeafSize), maxLeafSize);

      const col = i % cols;
      const row = Math.floor(i / cols);

      const x =
        centerX -
        rangeX +
        col * cellW +
        cellW * 0.5 +
        (Math.random() - 0.5) * cellW * 0.9;
      const y =
        centerY -
        rangeY +
        row * cellH +
        cellH * 0.5 +
        (Math.random() - 0.5) * cellH * 0.9;

      const categoryId = categoryIds[dataIndex];
      const dotColor = colorMap[categoryId] ?? colors?.[0];

      arr.push({ x, y, size: finalSize, color: dotColor, catId: categoryId });
    }

    runOnJS(setPositionsWithCache)(arr);
    return arr;
  }, [
    decimalsValue,
    colors,
    totalJS,
    categoryIdsValue,
    categoryColorMapValue,
    leafCenterXValue,
    leafCenterYValue,
  ]);

  return (
    <View
      style={[
        styles.container,
        { height: heightFull, overflow: "visible", width: "100%" },
      ]}
    >
      <DotsCanvas 
        canvasKey={canvasKey}
        canvasHeight={canvasHeight}
        heightFull={heightFull}
        color={color}
        positions={positions}
        totalJS={totalJS}
        canvasWidth={screenWidth}
        darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
        onCategoryPress={onCategoryPress} 
        onCenterPress={onCenterPress}
        onCenterSinglePress={onCenterSinglePress} 
        smallFont={smallFont}
        iconColor={iconColor}
        backgroundColor={"transparent"}
        catDecimalsValue={catDecimalsValue}
        labelsValue={labelsValue}
        coloredDotsModeValue={coloredDotsModeValue}
    
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  chartContainer: {},
  title: { fontSize: 24, margin: 10 },
});

export default React.memo(DotsPositionLayer);
