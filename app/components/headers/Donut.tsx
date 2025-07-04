import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  DimensionValue,
} from "react-native";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import PieChart from "react-native-pie-chart";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSharedValue, withTiming } from "react-native-reanimated";
import AnimatedPieChart from "./AnimatedPieChart";
import DonutChart from "./DonutChart";
import DonutPath from "./DonutPath";
import { useFont } from "@shopify/react-native-skia";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";

type Props = {
  data: string[];
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  colors: string[];
  widthAndHeight: DimensionValue;
  labelSize: number;
  onSectionPress: () => void;
};

const Donut = ({
  data,
  radius = 30,
  strokeWidth = 6,
  outerStrokeWidth = 8,
  colors,
  widthAndHeight = 50,
  labelSize = 9,
  onSectionPress = null,
}: Props) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  console.log(`colors in donut: `, colors);

  const { calculatePercentage } = useMomentSortingFunctions(data);
  const totalValue = useSharedValue(0);
  const decimalsValue = useSharedValue<number[]>([]);

      const RADIUS = radius;
  const DIAMETER = RADIUS * 2;
  const STROKE_WIDTH = strokeWidth;
  const OUTER_STROKE_WIDTH = outerStrokeWidth;
  const GAP = 0.05;

  // const total = data.reduce(
  //   (acc, currentValue) => acc + currentValue.size,
  //   0
  // );

  //  const generatePercentages = calculatePercentage(data, total);

  //  const generateDecimals = generatePercentages.map(
  //     number => Number(number.toFixed(0)) / 100,
  //  );

  // const RADIUS = 160;
  // const STROKE_WIDTH = 30;
  // const OUTER_STROKE_WIDTH = 46;
  // const GAP = 0.04;

  // const RADIUS = 40;
  // const DIAMETER = RADIUS * 2;
  // const STROKE_WIDTH = 8;
  // const OUTER_STROKE_WIDTH = 10;
  // const GAP = 0.05;


  const getPieChartDataMetrics = (data) => {
    const total = data.reduce(
      (acc, currentValue) => acc + currentValue.size,
      0
    );

    const percentages = data.map((item) => (item.size / total) * 100);

    const decimals = percentages.map(
      (number) => Number(number.toFixed(0)) / 100
    );

    return {
      total,
      percentages,
      decimals,
    };
  };

  const generateGradientColors = (count) => {
    const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
    const rgbToHex = (rgb) =>
      "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

    const start = hexToRgb(manualGradientColors.darkColor);
    const end = hexToRgb(themeAheadOfLoading.darkColor);

    return Array.from({ length: count }, (_, i) => {
      const t = i / Math.max(count - 1, 1);
      const interpolated = start.map((s, j) =>
        Math.round(s + (end[j] - s) * t)
      );
      return rgbToHex(interpolated);
    });
  };
 
// DONT DELETE 
 const seriesData = useMemo(() => {
  if (!data) return;

  const dataCountList = data.filter((item) => Number(item.size) > 0);
  const { total, percentages, decimals } =
    getPieChartDataMetrics(dataCountList);

  const series = dataCountList.map((item, index) => ({
    ...item,
    label: {
      text: item.name,
      fontFamily: "Poppins-Regular",
      fontSize: labelSize,
      color: "transparent",
    },
    color: colors[index],
    percentage: percentages[index],
  }));

  return {
    series,
    total,
    decimals,
  };
}, [data, colors, labelSize]);

// ⬇ useEffect to set shared values
useEffect(() => {
  if (!seriesData) return;
  totalValue.value = withTiming(seriesData.total, { duration: 1000 });
  decimalsValue.value = [...seriesData.decimals];
}, [seriesData]);
 

  const font = useFont(require("@/app/assets/fonts/Poppins-Regular.ttf"), 30);

  const smallFont = useFont(
    require("@/app/assets/fonts/Poppins-Regular.ttf"),
    14
  );

  if (!font || !smallFont) {
    return <View />;
  }

  const fontColor = themeStyles.primaryText.color;
    const backgroundColor = themeStyles.primaryBackground.backgroundColor;

  const n = colors.length;

  return (
    // <ScrollView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* <PieChart widthAndHeight={widthAndHeight} series={seriesData} /> */}
      <View style={[{height: DIAMETER, width: DIAMETER, borderRadius: RADIUS, backgroundColor: themeStyles.primaryBackground.backgroundColor}]}>
        <DonutChart
          radius={RADIUS}
          strokeWidth={STROKE_WIDTH}
          outerStrokeWidth={OUTER_STROKE_WIDTH}
          totalValue={totalValue}
          font={font}
          smallFont={smallFont}
          color={fontColor}
          backgroundColor={backgroundColor}
          n={n}
          gap={GAP}
          decimalsValue={decimalsValue}
          colors={colors}
        />
      </View>
      {/* <AnimatedPieChart data={seriesData} size={widthAndHeight} radius={widthAndHeight / 2} onSectionPress={onSectionPress} /> */}
    </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  chartContainer: { 
  },
  title: { fontSize: 24, margin: 10 },
});

export default Donut;
