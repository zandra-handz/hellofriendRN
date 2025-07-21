import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  DimensionValue,
} from "react-native";
import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { useSharedValue, withTiming } from "react-native-reanimated";

import DonutChart from "./DonutChart";
import { useFont } from "@shopify/react-native-skia";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";

type Props = {
  onCategoryPress: () => void;
  onCategoryLongPress: () => void;
  onCenterPress: () => void;
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
  onCategoryPress,
  onCategoryLongPress,
  onCenterPress,
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
  const { themeStyles, manualGradientColors } = useGlobalStyle();
 
  // console.log(`colors in donut: `, colors);

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
  // console.log(`n in donut`, n);
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

    const labels = data.map((item) => ({
      name: item.name,
      user_category: item.user_category,
    }));

    // const percentages = data.map((item) => (item.size / total) * 100);
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

  // DONT DELETE
  const seriesData = useMemo(() => {
    if (!data) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    const { total, labels, percentages, decimals } =
      getPieChartDataMetrics(dataCountList);

    // const series = dataCountList.map((item, index) => ({
    //   ...item,
    //   label: {
    //     text: item.name,
    //     fontFamily: "Poppins-Regular",
    //     fontSize: labelSize,
    //     color: "transparent",
    //   },
    //   color: colors[index],
    //   percentage: percentages[index],
    // }));

    return {
      // series,
      labels,
      total,
      decimals,
    };
  }, [data, colors]); //, labelSize]);

  // ⬇ useEffect to set shared values
  useEffect(() => {
    if (!seriesData) return;
    totalValue.value = withTiming(seriesData.total, { duration: 1000 });
    decimalsValue.value = [...seriesData.decimals];
    labelsValue.value = [...seriesData.labels];
    // setLabelsJS(seriesData.labels);
  }, [seriesData]);

  const font = useFont(
    require("@/app/assets/fonts/Poppins-Regular.ttf"),
    centerTextSize
  );

  const smallFont = useFont(
    require("@/app/assets/fonts/Poppins-Regular.ttf"),
    14
  );

  if (!font || !smallFont) {
    return <View />;
  }

  const fontColor = themeStyles.primaryText.color;
  const backgroundColor = themeStyles.primaryBackground.backgroundColor;
  //const backgroundColor = 'transparent';

  return (
    // <ScrollView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* <PieChart widthAndHeight={widthAndHeight} series={seriesData} /> */}
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
          onCategoryPress={onCategoryPress}
          onCategoryLongPress={onCategoryLongPress}
          onCenterPress={onCenterPress}
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
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  chartContainer: {},
  title: { fontSize: 24, margin: 10 },
});

export default Donut;
