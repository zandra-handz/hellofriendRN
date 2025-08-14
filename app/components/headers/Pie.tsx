import { View, StyleSheet } from "react-native";
import React from "react";

// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
// import { useFriendList } from "@/src/context/FriendListContext";

import AnimatedPieChart from "./AnimatedPieChart";

type Props = {
 
  showPercentages: boolean,
  showLabels: boolean;
  widthAndHeight: number;

};

const Pie = ({
 
  showPercentages = false,
  showLabels = true,
  widthAndHeight = 50,
  labelsSize = 9,
  onSectionPress = null,
 
  seriesData,
  // onLongSectionPress = null,
}) => {
  // const { manualGradientColors, themeStyles } = useGlobalStyle();
  // const { themeAheadOfLoading } = useFriendList();

 
//   const colors = useMemo(() => {
//   if (!data) return [];

//   const count = data.filter((item) => Number(item.size) > 0).length;
//   const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
//   const rgbToHex = (rgb) =>
//     "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

//   const start = hexToRgb(manualGradientColors.darkColor);
//   const end = hexToRgb(themeAheadOfLoading.darkColor);

//   return Array.from({ length: count }, (_, i) => {
//     const t = i / Math.max(count - 1, 1);
//     const interpolated = start.map((s, j) =>
//       Math.round(s + (end[j] - s) * t)
//     );
//     return rgbToHex(interpolated);
//   });
// }, [data, manualGradientColors.darkColor, themeAheadOfLoading.darkColor]);

 

//   const seriesData = useMemo(() => {
//   if (!data) return;

//   const dataCountList = data.filter((item) => Number(item.size) > 0);
//   return dataCountList.map((item, index) => ({
//     ...item,
//     label: {
//       text: item.name.slice(0, 4),
//       fontFamily: "Poppins-Regular",
//       color: themeStyles.primaryText.color,
//       fontSize: labelsSize,
//     },
//     color: colors[index],
//   }));
// }, [data, colors, themeStyles.primaryText.color, labelsSize]);


 
  return (
    <View style={styles.container}>
      <AnimatedPieChart
        data={seriesData}
        showLabels={showLabels}
        showPercentages={showPercentages}
        labelsSize={labelsSize}
        size={widthAndHeight}
        radius={widthAndHeight / 2}
        onSectionPress={onSectionPress ? onSectionPress : null}
        // onLongSectionPress={onLongSectionPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  title: { fontSize: 24, margin: 10 },
});

export default Pie;
