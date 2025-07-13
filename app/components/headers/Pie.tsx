import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useMemo, useCallback } from "react";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";

import AnimatedPieChart from "./AnimatedPieChart";
const Pie = ({ data, widthAndHeight=50, labelsSize=9, onSectionPress=null, onLongSectionPress=null }) => {
    const { manualGradientColors, themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
 
console.log('pie component rerendered, size: ', widthAndHeight);

//   console.log(`sortedListLength: `, data.length);
//   console.log(data);
  // const [seriesData, setSeriesData ] = useState([]);



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
    let series = [];
    series = dataCountList.map((item, index) => ({
      ...item, 
      label: { text: item.name.slice(0,4),  fontFamily: 'Poppins-Regular', color: themeStyles.primaryText.color, fontSize: labelsSize },
      color: colors[index],
    }));

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

   
 
  return (
    // <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <PieChart widthAndHeight={widthAndHeight} series={seriesData} /> */}
        <AnimatedPieChart data={seriesData} size={widthAndHeight} radius={widthAndHeight / 2} onSectionPress={onSectionPress} onLongSectionPress={onLongSectionPress} />

       
      </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center"},
  title: { fontSize: 24, margin: 10 },
});

export default Pie;
