import { View, StyleSheet, DimensionValue } from "react-native";
import React, { useState, useEffect } from "react";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import NotDonutChart from "./NotDonutChart";
import { calculatePercentage } from "@/src/hooks/GradientColorsUril";

const NotDonut = ({
  canvasKey,
  iconColor,
  darkerOverlayBackgroundColor,
  onCategoryPress,
  onCategoryLongPress,
  onCenterPress,
  totalJS,
  categoryData,
  data,
  radius = 40,
  strokeWidth = 6,
  outerStrokeWidth = 9,
  color,
  colors,
  colorsReversed,
  gap = 0.03,
  labelsSize = 8,
  labelsDistanceFromCenter = -17,
  labelsSliceEnd = 1,
  font,
  smallFont,
}) => {
  const [positions, setPositions] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  const totalValue = useSharedValue(0);
  const decimalsValue = useSharedValue<number[]>([]);
  const labelsValue = useSharedValue<string[]>([]);
  const categoryStopsValue = useSharedValue<number[]>([]);

  // NEW: category -> color map
  const categoryColorMapValue = useSharedValue<Record<number, string>>({});
  const categoryIdsValue = useSharedValue<number[]>([]);

  // NEED THIS TO STOP THE 'FLASH' OF OLD SHARED VALUES IN LEAVES WHEN FRIEND CHANGES
  useFocusEffect(
    useCallback(() => {
      totalValue.value = 0;
      decimalsValue.value = [];
      labelsValue.value = [];
      categoryStopsValue.value = [];
      setPositions([]);

      return () => {
        totalValue.value = 0;
        decimalsValue.value = [];
        labelsValue.value = [];
        categoryStopsValue.value = [];
        setPositions([]);
      };
    }, []),
  );

useEffect(() => {
  if (!categoryData || !colorsReversed) return;
  const map: Record<number, string> = {};
  categoryData.forEach((item, index) => {
    map[item.user_category] = colorsReversed[index] ?? colorsReversed[0];
  });
  categoryColorMapValue.value = map;
}, [categoryData, colorsReversed]);

useEffect(() => {
  if (!data) return;
  categoryIdsValue.value = data.map((d) => d.user_category);
}, [data]);

  const RADIUS = radius;
  const DIAMETER = RADIUS * 2;
  const STROKE_WIDTH = strokeWidth;
  const OUTER_STROKE_WIDTH = outerStrokeWidth;
  const GAP = gap;

  const getPieChartDataMetrics = (data) => {
    const total = data.reduce(
      (acc, currentValue) => acc + currentValue.size,
      0,
    );
    const labels = data.map((item) => ({
      name: item.name,
      user_category: item.user_category,
    }));
    const percentages = calculatePercentage(data, total);
    const decimals = percentages.map(
      (number) => Number(number.toFixed(0)) / 100,
    );
    return { total, labels, percentages, decimals };
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    if (dataCountList.length === 0) return;

    totalValue.value = 0;
    decimalsValue.value = [];
    labelsValue.value = [];
    categoryStopsValue.value = [];

    const { total, labels, decimals } = getPieChartDataMetrics(dataCountList);

    totalValue.value = withTiming(total, { duration: 1000 });
    decimalsValue.value = [...decimals];
    labelsValue.value = [...labels];

    let cumulative = 0;
    const categoryCounts = decimals.map((d) => {
      const count = Math.round(total * d);
      cumulative += count;
      return cumulative;
    });
    categoryStopsValue.value = categoryCounts;
  }, [data, colors, totalJS]);

  const leafRadius = radius - labelsSize - 20;
const leafCenterX = radius;
const leafCenterY = radius;

  const leafXs = useSharedValue<number[]>([]);
  const leafYs = useSharedValue<number[]>([]);
  const leafSizes = useSharedValue<number[]>([]);

const leafPositionsCombined = useDerivedValue(() => {
  "worklet";

  const decimals = decimalsValue.value;
  if (!decimals || decimals.length < 1) {
    runOnJS(setPositions)([]);
    return [];
  }

  const categoryIds = categoryIdsValue.value;
  const colorMap = categoryColorMapValue.value;

  const arr: { x: number; y: number; size: number; color: string }[] = [];

  const total2 = totalJS;
  let cumulative2 = 0;
  const categoryCounts = decimals.map((d) => {
    const count = Math.round(total2 * d);
    cumulative2 += count;
    return cumulative2;
  });

  const n = categoryCounts.length ?? 0;
const rangeX = 140;  // was 60
const rangeY = 140;  // was 60


  for (let i = 0; i < n; i++) {
    const decSize = decimals[i] ?? 1;
    // const minLeafSize = 2;
    // const maxLeafSize = 6;
    const minLeafSize = 1;  // was 2
const maxLeafSize = 3;  // was 6
    const scaleFactor = 7 / n;
    const baseSize =
      minLeafSize + decSize * (maxLeafSize - minLeafSize) * scaleFactor;
    const variance = 0.2;

    let finalSize = baseSize * (1 + (Math.random() * 2 - 1) * variance);
    finalSize = Math.min(Math.max(finalSize, minLeafSize), maxLeafSize);

    const categoryId = categoryIds[i];
    const dotColor = colorMap[categoryId] ?? colorsReversed?.[0];

    arr.push({
      x: leafCenterX + (Math.random() - 0.5) * rangeX * 2,
      y: leafCenterY + (Math.random() - 0.5) * rangeY * 2,
      size: finalSize,
      color: dotColor,
    });
  }

  runOnJS(setPositions)(arr);
  return arr;
}, [decimalsValue, colorsReversed, totalJS, categoryIdsValue, categoryColorMapValue]);
  return (
    <View style={styles.container}>
      <View
        style={{
          height: DIAMETER + 10,
          width: DIAMETER + 10,
          borderRadius: RADIUS,
          overflow: "visible",
        }}
      >
        <NotDonutChart
          canvasKey={canvasKey}
          color={color}
          animatedLeaves={leafPositionsCombined}
          positions={positions}
          totalJS={totalJS}
          darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
          onCategoryPress={onCategoryPress}
          onCategoryLongPress={onCategoryLongPress}
          onCenterPress={onCenterPress}
          radius={RADIUS}
          strokeWidth={STROKE_WIDTH}
          outerStrokeWidth={OUTER_STROKE_WIDTH}
          totalValue={totalValue}
          categoryStopsValue={categoryStopsValue}
          colorsReversed={colorsReversed}
          font={font}
          smallFont={smallFont}
          leafXs={leafXs}
          leafYs={leafYs}
          leafSizes={leafSizes}
          iconColor={iconColor}
          backgroundColor={"transparent"}
          n={colors?.length}
          gap={GAP}
          decimalsValue={decimalsValue}
          labelsValue={labelsValue}
          colors={colors}
          labelsSize={labelsSize}
          labelsDistanceFromCenter={labelsDistanceFromCenter}
          labelsSliceEnd={labelsSliceEnd}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  chartContainer: {},
  title: { fontSize: 24, margin: 10 },
});

export default React.memo(NotDonut);