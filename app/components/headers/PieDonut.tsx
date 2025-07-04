import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useMemo, useCallback } from "react";
import PieChart from "react-native-pie-chart";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSharedValue, withTiming } from "react-native-reanimated";
import AnimatedPieChart from "./AnimatedPieChart";
import DonutChart from "./DonutChart";
import { useFont } from "@shopify/react-native-skia";
 import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
const PieDonut = ({ data, widthAndHeight=50, labelSize=9, onSectionPress=null }) => {
    const { themeStyles, manualGradientColors } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();

const { calculatePercentage } = useMomentSortingFunctions(data);
    const totalValue = useSharedValue(0);
    const decimalValues = useSharedValue<number[]>([]);
 
// const total = data.reduce(
//   (acc, currentValue) => acc + currentValue.size,
//   0  
// );

//  const generatePercentages = calculatePercentage(data, total);
 
//  const generateDecimals = generatePercentages.map(
//     number => Number(number.toFixed(0)) / 100,
//  );

const RADIUS = 160;
const STROKE_WIDTH = 30;
const OUTER_STROKE_WIDTH = 46;
const GAP = 0.04;
 
 const getPieChartDataMetrics = (data) => {
  const total = data.reduce((acc, currentValue) => acc + currentValue.size, 0);

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
    '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

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




  const seriesData = useMemo(() => {
    if (!data) {
      return;
    }

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    // console.log('new count: ', dataCountList.length);

    let colors = generateGradientColors(dataCountList.length);
    if (!colors) {
        return;
    }
const { total, percentages, decimals } = getPieChartDataMetrics(data);

    let series = [];
    series = dataCountList.map((item, index) => ({
      ...item,
      label: { text: item.name, fontFamily: 'Poppins-Regular', fontSize: labelSize, color: 'transparent'  },
      color: colors[index],
      percentage: percentages[index],
      
    //   percentage: calculatePercentage([item.size], total),
   
    }));

    totalValue.value = withTiming(total, {duration: 1000});
    decimalValues.value = [...decimals];
    // console.log(typeof series);

    return series;
  }, [data]);





//   console.log(seriesData);

  // const handleGetSlices = () => {
  //     let newArray = [];
  // newArray = data.map((item, index) =>
  // ...item,
  //  value = item.size,
  // color = colorList[index],
 

      const font = useFont(require("@/app/assets/fonts/Poppins-Regular.ttf"),60);
   
      const smallFont = useFont(require("@/app/assets/fonts/Poppins-Regular.ttf"),14);
   
   if (!font || !smallFont) {
      return <View />
   }
   
  return (
    // <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <PieChart widthAndHeight={widthAndHeight} series={seriesData} /> */}
       <View style={styles.chartContainer}>
        
        <DonutChart 
        radius={RADIUS}
        strokeWidth={STROKE_WIDTH}
        outerStrokeWidth={OUTER_STROKE_WIDTH}
        totalValue={totalValue}
        font={font}
        smallFont={smallFont} 
        color={themeStyles.primaryText.color}
        
        
        />

        
       </View>
        <AnimatedPieChart data={seriesData} size={widthAndHeight} radius={widthAndHeight / 2} onSectionPress={onSectionPress} />

       
      </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center"},
  chartContainer: {
    width: 160 * 2,
    height: 160 * 2,


  },
  title: { fontSize: 24, margin: 10 },
});

export default PieDonut;
