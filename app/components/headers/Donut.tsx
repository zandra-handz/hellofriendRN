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
  console.log("donut rerendered");

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
  console.log("DONUT CHART RERENDERED", colors);

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

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    if (dataCountList.length === 0) return;

    totalValue.value = 0;
    decimalsValue.value = [];
    labelsValue.value = [];
    categoryStopsValue.value = [];
    // setColorsSynced([]);
    const { total, labels, percentages, decimals } =
      getPieChartDataMetrics(dataCountList);

    console.log("SERIES DATA UPDATED");

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
    // setColorsSynced(colors);
    // setTotalJSSynced(totalJS)
  }, [data, colors, totalJS]);

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
    console.log(`cat values`, categoryStopsValue.value);
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

  const spread = 1;

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

    const n = totalCategories.value;
    const arr: { x: number; y: number; size: number; color: string }[] = [];

    // const boxSize = leafRadius * 2;
    const boxSize = leafRadius * 1;
    const columns = Math.ceil(Math.sqrt(n - 1));
    const rows = Math.ceil((n - 1) / columns);

    for (let i = 0; i < n; i++) {
      const decSize = decimalsValue.value[i] ?? 1;
      const rawSize = decSize * 10;
      const leafSize = Math.min(Math.max(rawSize, minLeafSize), maxLeafSize);

      // can remove this part if don't want
      // Optional variance
      // const variance = 0.2;
      // const finalSize = leafSize * (1 + (Math.random() * 2 - 1) * variance);

      const variance = 0.2;
      let finalSize = leafSize * (1 + (Math.random() * 2 - 1) * variance);

      // clamp again to enforce min/max
      finalSize = Math.min(Math.max(finalSize, minLeafSize), maxLeafSize);

      // spread multiplier should probably depend on how many categories there are
      const spreadMultiplier = 1;

      if (i === 0) {
        arr.push({
          x: leafCenterX - finalSize,
          y: leafCenterY,
          size: finalSize,
          color: colors[i] ?? colors[0],
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
          color: colors[i] ?? colors[0],
        });
      }
    }

    return arr;
  }, [decimalsValue, colors, totalCategories]);

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

  // useDerivedValue(() => {
  //   'worklet';

  //   // guard to avoid spamming
  //   if (
  //     !totalJS ||
  //     !decimalsValue.value ||
  //     decimalsValue.value.length < 1 ||
  //     totalJS < totalValue.value
  //   ) {
  //     if (lastCount.value !== -1) {
  //       runOnJS(setPositions)([]);
  //       lastCount.value = -1;
  //     }
  //     return;
  //   }

  //   const n = Math.round(categoryTotals.value)

  //   // avoid redundant updates
  //   if (lastCount.value === n) return;

  //   const arr: { x: number; y: number; size: number; color: string }[] = [];
  //   const boxSize = leafRadius * 2;
  //   const columns = Math.ceil(Math.sqrt(n - 1));
  //   const rows = Math.ceil((n - 1) / columns);

  //   for (let i = 0; i < n; i++) {
  //     const decSize = decimalsValue.value[i] ?? 1;

  //     if (i === 0) {
  //       arr.push({
  //         x: leafCenterX - decSize * 10,
  //         y: leafCenterY,
  //         size: decSize * 10,
  //         color: colors[0],

  //       });
  //     } else {
  //       const index = i - 1;
  //       const col = index % columns;
  //       const row = Math.floor(index / columns);
  //       const offsetX = ((col + 0.5) / columns - 0.5) * boxSize * 2.4 + decSize * 5;
  //       const offsetY = ((row + 0.5) / rows - 0.5) * boxSize * 2.4 + decSize * 5;

  //       arr.push({
  //         x: leafCenterX + offsetX,
  //         y: leafCenterY + offsetY,
  //         size: decSize * 10,
  //         color: colors[i] ?? colors[0],
  //       });
  //     }

  //         scale.value = withDelay(
  //       i * 120,
  //       withTiming((i + 1) * 0.5, {
  //         duration: 100,
  //         easing: Easing.out(Easing.exp),
  //       })
  //     );
  //   }

  //   // ✅ push to JS only when it changes
  //   runOnJS(setPositions)(arr);
  //   lastCount.value = n;
  // }, [totalJS, decimalsValue, colors, categoryTotals, lastFlush ]);

  // // run the equivalent of calculateLeaves worklet
  // useDerivedValue(() => {
  //   // guard
  //   if (
  //     !totalJS ||
  //     !decimalsValue.value ||
  //     decimalsValue.value.length < 1 ||
  //     totalJS < totalValue.value
  //   ) {
  //     if (lastCount.value !== -1) {
  //       positionsValue.value = [];
  //       lastCount.value = -1;
  //     }
  //     return;
  //   }

  //   const n = Math.round(categoryStopsValue.value[categoryStopsValue.value.length - 1] || 0);

  //   if (lastCount.value === n) return;

  //   const arr: { x: number; y: number; size: number; color: string }[] = [];
  //   const boxSize = RADIUS * 2;
  //   const columns = Math.ceil(Math.sqrt(n - 1));
  //   const rows = Math.ceil((n - 1) / columns);

  //   for (let i = 0; i < n; i++) {
  //     const decSize = decimalsValue.value[i] ?? 1;

  //     if (i === 0) {
  //       arr.push({
  //         x: RADIUS - decSize * 10,
  //         y: RADIUS,
  //         size: decSize * 10,
  //         color: colors[0],
  //       });
  //     } else {
  //       const index = i - 1;
  //       const col = index % columns;
  //       const row = Math.floor(index / columns);

  //       const offsetX = ((col + 0.5) / columns - 0.5) * boxSize * 2.4 + decSize * 5;
  //       const offsetY = ((row + 0.5) / rows - 0.5) * boxSize * 2.4 + decSize * 5;

  //       arr.push({
  //         x: RADIUS + offsetX,
  //         y: RADIUS + offsetY,
  //         size: decSize * 10,
  //         color: colors[i] ?? colors[0],
  //       });
  //     }

  //     // animate scale per leaf
  //     scale.value = withDelay(
  //       i * 120,
  //       withTiming((i + 1) * 0.5, {
  //         duration: 100,
  //         easing: Easing.out(Easing.exp),
  //       })
  //     );
  //   }

  //   positionsValue.value = arr;
  //   lastCount.value = n;
  // }, [decimalsValue, colors, totalJS]);

  // useEffect(() => {
  //   if (!data || data.length === 0) return;

  //   const dataCountList = data.filter((item) => Number(item.size) > 0);
  //   if (dataCountList.length === 0) return;

  //   const { total, labels, percentages, decimals } = getPieChartDataMetrics(dataCountList);

  //   // Update shared values
  //   totalValue.value = withTiming(total, { duration: 1000 });
  //   decimalsValue.value = [...decimals];
  //   labelsValue.value = [...labels];

  //   let cumulative = 0;
  //   const categoryCounts = decimals.map((d) => {
  //     const count = Math.round(total * d);
  //     cumulative += count;
  //     return cumulative;
  //   });
  //   categoryStopsValue.value = categoryCounts;

  //   // Trigger the leaf calculation worklet
  //   calculateLeavesWorklet({
  //     totalJS: total,
  //     categoryTotals: categoryStopsValue,
  //     lastCount: useSharedValue(-1), // could be a shared value defined in component
  //     scale: useSharedValue(0),
  //     count: totalValue,
  //     decimals: decimalsValue,
  //     colors,
  //     centerX: RADIUS,
  //     centerY: RADIUS,
  //     radius: RADIUS,
  //     positionsValue,
  //   });
  // }, [data, colors, totalJS]);

  // const seriesData = useMemo(() => {
  //   if (!data || data.length === 0) return null;

  //   const dataCountList = data.filter((item) => Number(item.size) > 0);
  //   if (dataCountList.length === 0) return null;

  //   const { total, labels, percentages, decimals } = getPieChartDataMetrics(dataCountList);

  //   return { labels, total, decimals, percentages };
  // }, [data, colors]);

  // useEffect(() => {
  //   if (!seriesData) return;

  //   console.log("SERIES DATA UPDATED", seriesData);

  //   // Update shared values safely
  //   totalValue.value = withTiming(seriesData.total ?? 0, { duration: 1000 });
  //   decimalsValue.value = seriesData.decimals ? [...seriesData.decimals] : [];
  //   labelsValue.value = seriesData.labels ? [...seriesData.labels] : [];

  //   let cumulative = 0;
  //   const categoryCounts =
  //     seriesData.decimals?.map((d) => {
  //       const count = Math.round(seriesData.total * d);
  //       cumulative += count;
  //       return cumulative;
  //     }) ?? [];

  //   categoryStopsValue.value = categoryCounts;
  // }, [seriesData]);

  // const seriesData = useMemo(() => {
  //   if (!data) return;

  //   const dataCountList = data.filter((item) => Number(item.size) > 0);
  //   const { total, labels, percentages, decimals } =
  //     getPieChartDataMetrics(dataCountList);

  //   return {
  //     labels,
  //     total,
  //     decimals,
  //     percentages,
  //   };
  // }, [data, colors]); //, labelSize]);

  // useEffect(() => {
  //   console.log('SERIES DATA')
  //   if (!seriesData) {
  //     console.log('NO SERIES DATA')

  //     return;
  //   }
  //   // THIS IS THE MASTER TRIGGER FOR WHOLE ANIMATION
  //   totalValue.value = withTiming(seriesData.total, { duration: 1000 });

  //   decimalsValue.value = [...seriesData.decimals];
  //   labelsValue.value = [...seriesData.labels];

  //   let cumulative = 0;
  //   const categoryCounts = seriesData.decimals.map((d) => {
  //     const count = Math.round(seriesData.total * d);
  //     cumulative += count;
  //     return cumulative;
  //   });

  //   categoryStopsValue.value = categoryCounts;
  // }, [seriesData]);

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
