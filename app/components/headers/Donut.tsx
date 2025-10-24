import { View, StyleSheet, DimensionValue } from "react-native";
import React, {  useState, useEffect } from "react"; 
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
 
  runOnJS,
} from "react-native-reanimated";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import DonutChart from "./DonutChart"; 
import { calculatePercentage } from "@/src/hooks/GradientColorsUril";
 
 

type Props = {
  onCategoryPress: () => void;
  onCategoryLongPress: () => void;
  onCenterPress: () => void;
  onPlusPress: () => void;
  data: string[];
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  colors: string[];
  widthAndHeight: DimensionValue;
  labelSize: number;
  gap: number;
  onSectionPress: () => void;
  labelsSize: number;
  labelsDistanceFromCenter: number;
  labelsSliceEnd: number;
  centerTextSize: number;
};

const Donut = ({
  selectedFriendIdValue,
  friendStyle,
  primaryColor,
  darkerOverlayBackgroundColor,
  onCategoryPress,
  onCategoryLongPress,
  onPlusPress,
  onCenterPress,
  totalJS,
  data,
  radius = 40,
  strokeWidth = 6,
  outerStrokeWidth = 9,
  colors,
  colorsReversed,
  gap = 0.03,
  labelsSize = 8,
  labelsDistanceFromCenter = -17,
  labelsSliceEnd = 1,
  // centerTextSize = 26, SET IN APP ROUTE NOW BC SKIA FONT WAS TAKING TOO LONG SO PUT IT UP THERE
  font,
  smallFont,
}: Props) => {
  console.log('DONUT RERENDERED')

  // const font = useFont(Poppins_400Regular, centerTextSize);
  // const smallFont = useFont(Poppins_400Regular, 14);



  const [positions, setPositions] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  
  const totalValue = useSharedValue(0);
  const decimalsValue = useSharedValue<number[]>([]);
  const labelsValue = useSharedValue<string[]>([]); 

 

  // NEED THIS TO STOP THE 'FLASH' OF OLD SHARED VALUES IN LEAVES WHEN FRIEND CHANGES
 useFocusEffect(
  useCallback(() => {
 console.log('setting values to 0') 
    console.warn("RESETTING LEAF VALUES");

    totalValue.value = 0;
    decimalsValue.value = [];
    labelsValue.value = [];
    categoryStopsValue.value = [];
    positionsValue.value = [];
    setPositions([]);

    return () => { 
      console.warn("RESETTING LEAF VALUES");
      totalValue.value = 0;
      decimalsValue.value = [];
      labelsValue.value = [];
      categoryStopsValue.value = [];
      positionsValue.value = [];
      setPositions([]);
    };
  }, [])
);
  const RADIUS = radius;
  const DIAMETER = RADIUS * 2;
  const STROKE_WIDTH = strokeWidth;
  const OUTER_STROKE_WIDTH = outerStrokeWidth;
  const GAP = gap;
  //const n = colors?.length;

 

  const categoryStopsValue = useSharedValue<number[]>([]);
 
  const getPieChartDataMetrics = (data) => {
    console.log('GETTING PIE DATA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    const total = data.reduce(
      (acc, currentValue) => acc + currentValue.size,
      0
    );

    const labels = data.map((item) => ({
      name: item.name,
      user_category: item.user_category,
    }));
    const percentages = calculatePercentage(data, total);

    const reverseDecimals = percentages
      .map((number) => Number(number.toFixed(0)) / 100)
      .reverse();

    const decimals = percentages.map(
      (number) => Number(number.toFixed(0)) / 100
    );
    return {
      total,
      labels,
      percentages,
      decimals,
      reverseDecimals,
    };
  };
 

  const reverseDecimalsValue = useSharedValue([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    if (dataCountList.length === 0) return;

    totalValue.value = 0;
    decimalsValue.value = [];

    reverseDecimalsValue.value = [];

    labelsValue.value = [];
    categoryStopsValue.value = [];
    // setColorsSynced([]);
    const { total, labels,  decimals, reverseDecimals } =
      getPieChartDataMetrics(dataCountList);

    console.log("SERIES DATA UPDATED");

    totalValue.value = withTiming(total, { duration: 1000 });
    decimalsValue.value = [...decimals];
    reverseDecimalsValue.value = [...reverseDecimals];
    labelsValue.value = [...labels];

    let cumulative = 0;
    const categoryCounts = decimals.map((d) => {
      const count = Math.round(total * d);
      cumulative += count;
      return cumulative;
    });

    categoryStopsValue.value = categoryCounts;
 
  }, [data, colors, totalJS]); //colors  // colors reversed always happens afyer colors
 
  const positionsValue = useSharedValue<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  const totalCategories = useDerivedValue(() => {
    return categoryStopsValue.value?.length ?? 0; // e.g. 7
  });

  const leafRadius = radius - labelsSize - 20;
  const leafCenterX = radius - labelsSize - 40;
  const leafCenterY = radius / 2;

  const leafPositions = useDerivedValue(() => {
    "worklet";
 

    const decimals = decimalsValue.value;
    if (!decimals || decimals.length < 1) return [];

    const n = totalCategories.value;
    const arr: { x: number; y: number; size: number; color: string }[] = [];

    const twoPi = Math.PI * 2;
    const total = decimals.reduce((a, b) => a + b, 0);
 
    const normalized = decimals.map((d) => d / total);
 
    let cumulative = 0;
    const midAngles = normalized.map((v) => {
      const start = cumulative;
      const end = cumulative + v * twoPi;
      const mid = start + (end - start) / 2;
      cumulative = end;
      return mid;
    });

    for (let i = 0; i < n; i++) {
      const decSize = decimals[i] ?? 1;
      const minLeafSize = 2;
      const maxLeafSize = 6;
      const scaleFactor = 7 / n;
      const baseSize =
        minLeafSize + decSize * (maxLeafSize - minLeafSize) * scaleFactor;
      const variance = 0.2;

      let finalSize = baseSize * (1 + (Math.random() * 2 - 1) * variance);
      finalSize = Math.min(Math.max(finalSize, minLeafSize), maxLeafSize);

      if (n === 1) {
        arr.push({
          x: leafCenterX - finalSize,
          y: leafCenterY - finalSize,
          size: finalSize,
          color: colorsReversed?.[i] ?? colorsReversed?.[0],
        });
      } else {
        const angle = midAngles[i % midAngles.length] + 300;
        const offset = leafRadius / 2 + finalSize / 2;
        const offsetX = offset * Math.cos(-angle);
        const offsetY = offset * Math.sin(-angle);

        arr.push({
          x: leafCenterX + offsetX,
          y: leafCenterY + offsetY,
          size: finalSize,
          color: colorsReversed?.[i] ?? colorsReversed?.[0],
        });
      }
    }

    return arr;
  }, [decimalsValue, colorsReversed, totalCategories, selectedFriendIdValue]);

  const animatedLeaves = useDerivedValue(() => {
    "worklet";
    const base = leafPositions.value; 

    if (!base || base.length === 0) return [];

    return base.map((leaf, i) => ({
      x: leaf.x,
      y: leaf.y,
      size: leaf.size, 
      color: leaf.color,
    }));
  });

 
  useDerivedValue(() => {
    "worklet";
    runOnJS(setPositions)(animatedLeaves.value);
  }, [animatedLeaves]);

 


 

  //   if (!font || !smallFont) {
     
  //   return <View />;
  // }

  const fontColor = primaryColor;
  const iconColor = friendStyle.lightColor;
  const backgroundColor = "transparent";

  return (
    <View style={styles.container}>
      <View
        style={[
          {
            height: DIAMETER,
            width: DIAMETER,
            borderRadius: RADIUS,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <DonutChart
        animatedLeaves={animatedLeaves}
        
      
          positionsValue={positionsValue} 
          positions={positions}
          totalJS={totalJS}
          primaryColor={primaryColor}
          darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
          onCategoryPress={onCategoryPress}
          onCategoryLongPress={onCategoryLongPress}
          onPlusPress={onPlusPress}
          onCenterPress={onCenterPress}
          radius={RADIUS}
          strokeWidth={STROKE_WIDTH}
          outerStrokeWidth={OUTER_STROKE_WIDTH}
          totalValue={totalValue}
          categoryStopsValue={categoryStopsValue}
          font={font}
          smallFont={smallFont}
          color={fontColor}
          iconColor={iconColor}
          backgroundColor={backgroundColor}
          n={colors?.length}
          gap={GAP}
          decimalsValue={decimalsValue}
          labelsValue={labelsValue}
          // labelsJS={labelsJS} // using derived value internally
          colors={colors}
          labelsSize={labelsSize}
          labelsDistanceFromCenter={labelsDistanceFromCenter}
          labelsSliceEnd={labelsSliceEnd}
        />
      </View>
      {/* <AnimatedPieChart data={seriesData} size={widthAndHeight} radius={widthAndHeight / 2} onSectionPress={onSectionPress} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  chartContainer: {},
  title: { fontSize: 24, margin: 10 },
});

export default Donut;
