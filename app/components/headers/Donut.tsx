import {
  View, 
  StyleSheet, 
  DimensionValue,
} from "react-native"; 
import React, {   useMemo,  useEffect } from "react";
 
import { useSharedValue, withTiming, useDerivedValue  } from "react-native-reanimated";
 
import DonutChart from "./DonutChart";
import { useFont } from "@shopify/react-native-skia";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";

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
 
 

  const getPieChartDataMetrics = (data) => {
    // console.warn(`DATA TO MAKE SERIES DATA: `, data);
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

  // DONT DELETE
  const seriesData = useMemo(() => {
    if (!data) return;

    const dataCountList = data.filter((item) => Number(item.size) > 0);
    const { total, labels, percentages, decimals } =
      getPieChartDataMetrics(dataCountList);
 
    return {
    
      labels,
      total,
      decimals,
      percentages,
    };
  }, [data, colors]); //, labelSize]);
 
  const categoryStopsValue = useSharedValue<number[]>([]);

// useEffect(() => {
//   if (!seriesData) return;

//   // cumulative totals per category
//   let cumulative = 0;
//   const categoryCounts = seriesData.decimals.map(d => {
//     const count = Math.round(seriesData.total * d);
//     cumulative += count;
//     return cumulative;
//   });

//   console.log(`~~~~~~~~~~~~~!@#$%~~~~~~~~~~~`, seriesData, categoryCounts);
//   // Animate to these new totals
//   categoryTotals.value = withTiming(categoryCounts, { duration: 1000 });
// }, [seriesData]);

  // ⬇ useEffect to set shared values
  useEffect(() => {
    if (!seriesData) return;
    totalValue.value = withTiming(seriesData.total, { duration: 1000 });
    
    decimalsValue.value = [...seriesData.decimals];
   labelsValue.value = [...seriesData.labels];


  let cumulative = 0;
  const categoryCounts = seriesData.decimals.map(d => {
    const count = Math.round(seriesData.total * d);
    cumulative += count;
    return cumulative;
  });

  // console.log(`~~~~~~~~~~~~~!@#$%~~~~~~~~~~~`, seriesData, categoryCounts);
  // Animate to these new totals
  categoryStopsValue.value = categoryCounts; 

  

 
  }, [seriesData]);


  const categoryTotals = useDerivedValue(() => {
  if (!categoryStopsValue.value || categoryStopsValue.value.length === 0) return 0;

  const total = Math.ceil(totalValue.value); // round up to match “current item”
  
  for (let i = 0; i < categoryStopsValue.value.length; i++) {
    if (total <= categoryStopsValue.value[i]) {
      return i + 1; // +1 because categories start at 1
    }
  }

  return categoryStopsValue.value.length; // fallback to last category
});
 

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

  const fontColor = primaryColor;
  const iconColor = friendStyle.lightColor; 
  const backgroundColor = 'transparent';

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
          categoryTotals={categoryTotals}
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
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  chartContainer: {},
  title: { fontSize: 24, margin: 10 },
});

export default Donut;
