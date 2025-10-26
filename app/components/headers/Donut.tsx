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

import DonutChart from "./DonutChart";
import { calculatePercentage } from "@/src/hooks/GradientColorsUril";

type Props = {
  onCategoryPress: () => void;
  onCategoryLongPress: () => void;
  onCenterPress: () => void;
  // onPlusPress: () => void;
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
  iconColor,

  darkerOverlayBackgroundColor,
  onCategoryPress,
  onCategoryLongPress,
  // onPlusPress,
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
  console.log("DONUT RERENDERED");

  // const font = useFont(Poppins_400Regular, centerTextSize);
  // const smallFont = useFont(Poppins_400Regular, 14);

  console.log("DONUT:", data[0]);
  console.log("DONUT:", colors[0]);
  console.log("DONUT:", colorsReversed[0]);
  console.log(totalJS);

  const [positions, setPositions] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  const totalValue = useSharedValue(0);
  const decimalsValue = useSharedValue<number[]>([]);
  const labelsValue = useSharedValue<string[]>([]);
    const categoryStopsValue = useSharedValue<number[]>([]);

  // NEED THIS TO STOP THE 'FLASH' OF OLD SHARED VALUES IN LEAVES WHEN FRIEND CHANGES
  useFocusEffect(
    useCallback(() => {
      console.log("setting values to 0");
      console.warn("RESETTING LEAF VALUES");

      totalValue.value = 0;
      decimalsValue.value = [];
      labelsValue.value = [];
      categoryStopsValue.value = [];

      setPositions([]);

      return () => {
        console.warn("RESETTING LEAF VALUES");
        totalValue.value = 0;
        decimalsValue.value = [];
        labelsValue.value = [];
        categoryStopsValue.value = [];
       
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



  const getPieChartDataMetrics = (data) => {
    console.log("(INSIDE SERIES DATA) GETTING PIE CHART DATA METRICS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    const total = data.reduce(
      (acc, currentValue) => acc + currentValue.size,
      0
    );

    const labels = data.map((item) => ({
      name: item.name,
      user_category: item.user_category,
    }));
    const percentages = calculatePercentage(data, total);
 
    const decimals = percentages.map(
      (number) => Number(number.toFixed(0)) / 100
    );
    return {
      total,
      labels,
      percentages,
      decimals, 
    };
  };

  // const reverseDecimalsValue = useSharedValue([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    if (dataCountList.length === 0) return;

      console.log("GETTING SERIES DATA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    totalValue.value = 0;
    decimalsValue.value = [];
    labelsValue.value = [];
    categoryStopsValue.value = [];
  
    const { total, labels, decimals } = getPieChartDataMetrics(dataCountList);



    totalValue.value = withTiming(total, { duration: 1000 });
    decimalsValue.value = [...decimals];
    // reverseDecimalsValue.value = [...reverseDecimals];
    labelsValue.value = [...labels];

    let cumulative = 0;
    const categoryCounts = decimals.map((d) => {
      const count = Math.round(total * d);
      cumulative += count;
      return cumulative;
    });

    categoryStopsValue.value = categoryCounts;
  }, [data, colors, totalJS]); //colors  // colors reversed always happens afyer colors
 
  const leafRadius = radius - labelsSize - 20;
  const leafCenterX = radius - labelsSize - 40;
  const leafCenterY = radius / 2;

  const leafXs = useSharedValue<number[]>([]);
  const leafYs = useSharedValue<number[]>([]);
  const leafSizes = useSharedValue<number[]>([]);

 

  const leafPositionsCombined = useDerivedValue(() => {
    "worklet";

  const decimals = decimalsValue.value;
  if (!decimals || decimals.length < 1) {
    runOnJS(setPositions)([]); // clear immediately
    return [];
  }

 

    const arr: { x: number; y: number; size: number; color: string }[] = [];

    const twoPi = Math.PI * 2;
    const total = decimals.reduce((a, b) => a + b, 0);
    const normalized = decimals.map((d) => d / total);

  const total2 = totalJS; // use the shared value
  let cumulative2 = 0;
  const categoryCounts = decimals.map((d) => {
    const count = Math.round(total2 * d);
    cumulative2 += count;
    return cumulative2;
  });

  const n = categoryCounts.length ?? 0;

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

    // update React state for DonutChart
    runOnJS(setPositions)(arr);

    return arr; // can be used as animatedLeaves internally
  }, [decimalsValue, colorsReversed, totalJS ]);
 

  return (
    <View style={styles.container}>
      <View
        style={[
          {
            height: DIAMETER,
            width: DIAMETER,
            borderRadius: RADIUS,
          },
        ]}
      >
        <DonutChart
          // animatedLeaves={animatedLeaves}
          animatedLeaves={leafPositionsCombined}
          positions={positions}
          totalJS={totalJS}
          darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
          onCategoryPress={onCategoryPress}
          onCategoryLongPress={onCategoryLongPress}
          // onPlusPress={onPlusPress}
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

export default React.memo(Donut);
