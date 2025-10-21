import { View, StyleSheet, DimensionValue } from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { calculateLeavesWorklet } from "./UtilLeafCalc";
import DonutChart from "./DonutChart";
import { useFont } from "@shopify/react-native-skia";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { useCapsuleList } from "@/src/context/CapsuleListContext";

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
  centerTextSize = 26,
}: Props) => {
  const { capsuleList } = useCapsuleList();
  const { selectedFriend } = useSelectedFriend();
  // console.log(`colors in donut: `, colors);
  //   console.log(`data in donut: `, data);
  const { calculatePercentage } = useMomentSortingFunctions(data);
  const totalValue = useSharedValue(0);
  const decimalsValue = useSharedValue<number[]>([]);
  const labelsValue = useSharedValue<string[]>([]);
  // const [ labelsJS, setLabelsJS ] = useState([]);

  const RADIUS = radius;
  const DIAMETER = RADIUS * 2;
  const STROKE_WIDTH = strokeWidth;
  const OUTER_STROKE_WIDTH = outerStrokeWidth;
  const GAP = gap;
  const n = colors.length;
 

  // DONT DELETE
  // const [ colorsSynced, setColorsSynced] = useState(['transparent']);
  // const [ totalJSSynced, setTotalJSSynced] = useState(0)
  const categoryStopsValue = useSharedValue<number[]>([]);
  // console.log("donut rerendered");

  useEffect(() => {
    if (selectedFriend?.id) {
      resetLeaves();
    }
  }, [selectedFriend?.id]);

  const lastFlush = useSharedValue(Date.now());
  // Whenever you want to flush old leaves:

  const resetLeaves = () => {
    lastFlush.value = Date.now();
  };
 

  const getPieChartDataMetrics = (data) => {
    const total = data.reduce(
      (acc, currentValue) => acc + currentValue.size,
      0
    );

    const labels = data.map((item) => ({
      name: item.name,
      user_category: item.user_category,
    }));
    const percentages = calculatePercentage(data, total);

    const reverseDecimals = percentages.map(
      (number) => Number(number.toFixed(0)) / 100
    ).reverse();

    const decimals = percentages
  .map((number) => Number(number.toFixed(0)) / 100)
  ;


    return {
      total,
      labels,
      percentages,
      decimals,
      reverseDecimals,
    };
  };
  // console.log("donut rerendered!");

  // useEffect(() => {
  //   if (selectedFriend?.id) {
  //     setTotalJSSynced(0)
  //     setColorsSynced([]);
  //     totalValue.value = 0;
  //     decimalsValue.value = [];
  //     labelsValue.value = [];
  //     categoryStopsValue.value = [];

  //   }
  //   console.log("weeeeeeeeeeeeeeeeee");
  // }, [selectedFriend?.id]);

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
    const { total, labels, percentages, decimals, reverseDecimals } =
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
    // setColorsSynced(colors);
    // setTotalJSSynced(totalJS)
  }, [data,  colorsReversed, totalJS]); //colors  // colors reversed always happens afyer colors

  // inside your Donut component
  const positionsValue = useSharedValue<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  // inside your Donut component

  const lastCount = useSharedValue(-1);
  const scale = useSharedValue(0);

  const categoryTotals = useDerivedValue(() => {
    if (!categoryStopsValue.value || categoryStopsValue.value.length === 0)
      return 0;
    const total = Math.ceil(totalValue.value);
    for (let i = 0; i < categoryStopsValue.value.length; i++) {
      if (total <= categoryStopsValue.value[i]) return i + 1;
    }
    return categoryStopsValue.value.length;
  });

  const [positions, setPositions] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  // figure out active category
  const activeLeafIndex = useDerivedValue(() => {
    "worklet";
    if (!categoryStopsValue.value || categoryStopsValue.value.length === 0)
      return 0;

    const total = Math.ceil(totalValue.value);
    for (let i = 0; i < categoryStopsValue.value.length; i++) {
      if (total <= categoryStopsValue.value[i]) return i; // 0-based index
    }
    return categoryStopsValue.value.length - 1;
  });

  const totalCategories = useDerivedValue(() => {
    return categoryStopsValue.value?.length ?? 0; // e.g. 7
  });

  const leafRadius = radius - labelsSize - 20;
  const leafCenterX = radius - labelsSize - 40;
  const leafCenterY = radius / 2;

  const minLeafSize = 3; // smallest leaf allowed
  const maxLeafSize = 6; // largest leaf allowed

  /**
   * 1️⃣ Static layout positions — fixed for all leaves
   */
  const leafPositions = useDerivedValue(() => {
    "worklet";

    if (!decimalsValue.value || decimalsValue.value.length < 1) return [];
    console.log(
      `dec valuesssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss`,
      decimalsValue.value
    );
    const n = totalCategories.value; 
    const arr: { x: number; y: number; size: number; color: string }[] = [];

    // const boxSize = leafRadius * 2;
    const boxSize = leafRadius * 1;
    const columns = Math.ceil(Math.sqrt(n - 1));
    const rows = Math.ceil((n - 1) / columns);

    for (let i = 0; i < n; i++) {
      const decSize = decimalsValue.value[i] ?? 1;

      

      const minLeafSize = 3;
      const maxLeafSize = 6;
      const scaleFactor = 7 / n; // e.g., fewer leaves → scale up, more leaves → scale down
      // console.log(`scale factor`, scaleFactor)
      const baseSize =
        minLeafSize + decSize * (maxLeafSize - minLeafSize) * scaleFactor;
        // console.log(`BASE SIZE`, baseSize)
      const variance = 0.2; // 20% random variation
      let finalSize = baseSize * (1 + (Math.random() * 2 - 1) * variance);

      // 4️⃣ Clamp to ensure min/max
      finalSize = Math.min(Math.max(finalSize, minLeafSize), maxLeafSize);

      // spread multiplier should probably depend on how many categories there are
      const spreadMultiplier = 1;

      if (i === 0) {
        arr.push({
          x: leafCenterX - finalSize,
          y: leafCenterY,
          size: finalSize,
          color: colorsReversed[i] ?? colorsReversed[0],
        });
      } else {
        const index = i - 1;
        const col = index % columns;
        const row = Math.floor(index / columns);
        const offsetX =
          ((col + 0.5) / columns - 0.5) * boxSize * spreadMultiplier;
        const offsetY = ((row + 0.5) / rows - 0.5) * boxSize * spreadMultiplier;

        arr.push({
          x: leafCenterX + offsetX,
          y: leafCenterY + offsetY,
          size: finalSize,
          color: colorsReversed[i] ?? colorsReversed[0],
        });
      }
    }

    return arr;
  }, [decimalsValue, colorsReversed, totalCategories]);

  /**
   * 2️⃣ Dynamic growth animation — how “grown” each leaf is (0–1)
   */
  const leafScales = useDerivedValue(() => {
    "worklet";
    if (!categoryStopsValue.value || categoryStopsValue.value.length === 0)
      return [];

    const n = categoryStopsValue.value.length;
    const scales: number[] = [];

    for (let i = 0; i < n; i++) {
      const stop = categoryStopsValue.value[i];
      const prevStop = i === 0 ? 0 : categoryStopsValue.value[i - 1];

      // progress from 0→1 within this stop
      const progress = Math.min(
        Math.max((totalValue.value - prevStop) / (stop - prevStop), 0),
        1
      );
 

      // easing curve
      const eased = Easing.out(Easing.cubic)(progress);

      scales.push(eased);
    }

    return scales;
  });

  /**
   * 3️⃣ Combine both into one array — animatedLeaves for rendering
   */
  const animatedLeaves = useDerivedValue(() => {
    "worklet";
    const base = leafPositions.value;
    const growth = leafScales.value;
    // console.log('base: ', base )
    // console.log('growth: ', growth)
   

    if (!base || base.length === 0) return [];

    return base.map((leaf, i) => ({
      x: leaf.x,
      y: leaf.y,
      size: leaf.size * (growth[i] ?? 0.001),
      color: leaf.color,
    }));
  });

  /**
   * 4️⃣ Push to JS only when necessary (for non-Skia rendering)
   */
  useDerivedValue(() => {
    "worklet";
    runOnJS(setPositions)(animatedLeaves.value);
  }, [animatedLeaves]);

 

  const font = useFont(Poppins_400Regular, centerTextSize);

  const smallFont = useFont(Poppins_400Regular, 14);

  if (!font || !smallFont) {
    return <View />;
  }

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
          lastFlush={lastFlush}
          resetLeaves={resetLeaves}
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
          n={n}
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
