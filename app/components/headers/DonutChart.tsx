import { View, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import {
  BlurMaskFilterProps,
  Canvas,
  Path,
  SkFont,
  Skia,
  Text,
  Rect,
  
  vec,
} from "@shopify/react-native-skia";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import DonutPath from "./DonutPath";
import { Text as RNText } from "react-native";
import {
  MaterialCommunityIcons,
  EvilIcons,
  FontAwesome,
  FontAwesome6,
} from "@expo/vector-icons";
import LeafPath from "./LeafPath";

type Props = {
  onCategoryPress: () => void;
  onCategoryLongPress: () => void;
  onCenterPress: () => void;
  onPlusPress: () => void;
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  font: SkFont;
  smallFont: SkFont;
  color: string;
  iconColor: string;
  backgroundColor: string;
  totalValue: SharedValue<number>;
  n: number;
  gap: number;
  labelsValue: SharedValue<object[]>;
  labelsJS: object[];
  decimalsValue: SharedValue<number[]>;
  categoryStopsValue: SharedValue<number[]>;
  colors: string[];
  labelsSize: number;
  labelsDistanceFromCenter: number;
  labelsSliceEnd: number;
};

const DonutChart = ({
  onCategoryPress,
  onCategoryLongPress,
  onPlusPress,
  onCenterPress,
  radius,
  strokeWidth,
  outerStrokeWidth,
  color,
  iconColor,
  backgroundColor,
  font,
  smallFont,
  totalValue,
  categoryStopsValue,
  n,
  gap,
  decimalsValue,
  categoryTotals,
  labelsValue,
  colors,
  labelsSize,
  labelsDistanceFromCenter,
  labelsSliceEnd,
}: Props) => {
  const array = Array.from({ length: n });

  const innerRadius = radius - outerStrokeWidth / 2;
  const { manualGradientColors } = useGlobalStyle();
  const [labelsJS, setLabelsJS] = useState([]);
  const [decimalsJS, setDecimalsJS] = useState([]);
  const [totalJS, setTotalJS] = useState([]);

  useDerivedValue(() => {
    const labelsSnapshot = labelsValue.value;
    runOnJS(setLabelsJS)(labelsSnapshot);
    console.log(`labels value`, labelsValue.value);
  }, [labelsValue]);

  useDerivedValue(() => {
    const decimalsSnapshot = decimalsValue.value;
    runOnJS(setDecimalsJS)(decimalsSnapshot);
    console.log(`decimals value`, decimalsValue.value);
  }, [decimalsValue]);

  const lastRoundedValue = useSharedValue(null);

  useDerivedValue(() => {
    const totalSnapshot = totalValue.value;
    const rounded = Math.ceil(totalSnapshot); // round up, no decimals

    if (lastRoundedValue.value !== rounded) {
      lastRoundedValue.value = rounded;
      runOnJS(setTotalJS)(totalSnapshot);
      // console.warn(`total value`, totalSnapshot);
    }
  }, [totalValue]);
  // useDerivedValue(() => {
  //   const totalSnapshot = totalValue.value;
  //   runOnJS(setTotalJS)(totalSnapshot);
  //   console.warn(`total value`, totalValue.value);
  // }, [totalValue]);

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(
    () => `${Math.round(totalValue.value)}`,
    []
  );
  // console.log(`n in donut chart: `, n);
  const targetCategories = useDerivedValue(
    () => `${Math.round(categoryTotals.value)}`,
    []
  );
  const fontSize = font.measureText("$0");
  // const smallFontSize = smallFont.measureText("Total");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 1.8;
  });

  const LabelOverlays = array.map((_, index) => {
    const categoryLabel = labelsJS[index]?.name || "";
    const categoryId = labelsJS[index]?.user_category || "";
    const decimal = decimalsJS[index];
    if (!decimal) return null;

    const centerX = radius;
    const centerY = radius;

    const start = decimalsJS.slice(0, index).reduce((acc, v) => acc + v, 0);

    const end = start + decimal;

    const midAngle = ((start + end) / 2) * 2 * Math.PI;
    const labelRadius = radius + labelsDistanceFromCenter;

    const x = centerX + labelRadius * Math.cos(midAngle);
    const y = centerY + labelRadius * Math.sin(midAngle);

    const labelText = categoryLabel.slice(0, labelsSliceEnd);

    const approxCharWidth = labelsSize * 0.55; // works well for Poppins-Regular
    const textWidth = labelText.length * approxCharWidth;
    const textHeight = labelsSize;

    return (
      <Pressable
        onPress={() => onCategoryPress(categoryLabel)} 
        key={index}
        style={({ pressed }) => [
          {
            zIndex: 66666,
            elevation: 66666,
            position: "absolute",
            left: x,
            top: y,
            transform: [
              { translateX: -textWidth / 2 },
              { translateY: -textHeight / 2 },
              ...(pressed ? [{ scale: 0.97 }] : []),
            ],
            backgroundColor: pressed ? "#ddd" : "transparent",
            padding: 4,
            borderRadius: 10,
            shadowOpacity: pressed ? 0.3 : 0,
          },
        ]}
      >
        <RNText
          style={{
            color: color,
            fontSize: labelsSize,
            fontFamily: "Poppins-Regular",
          }}
        >
          {labelText}
        </RNText>
      </Pressable>
    );
  });

 
  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color={backgroundColor}
          style={"stroke"}
          strokeWidth={outerStrokeWidth}
          strokeCap="round"
          strokeJoin="round"
          start={0}
          end={1}
        />

        {array.map((_, index) => {
          return (
            <React.Fragment key={index}>
              <DonutPath
                radius={radius}
                strokeWidth={strokeWidth}
                outerStrokeWidth={outerStrokeWidth}
                color={colors[index]}
                decimalsValue={decimalsValue}
                index={index}
                gap={gap}
              />
            </React.Fragment>
          );
        })}
        

        <Rect
          x={radius - 22}
          y={radius - 22}
      
          width={fontSize.width}
          height={fontSize.height}
        opacity={.5}
          color="black" // your desired background color
        />

        
 
        <LeafPath
          count={targetText}
          decimals={decimalsValue}
          categoryStops={categoryStopsValue}
          categoryTotals={targetCategories}
          centerX={radius - labelsSize - 10} // offset right of text
          centerY={radius - labelsSize - 10} // align vertically with text
          radius={radius / 4}
          size={24} 
          colors={colors}
      
        />

               <Text
          x={textX}
          y={radius + fontSize.height / 3.4}
          text={targetText}
          font={font}
          color={color}
        />
        
      </Canvas>
      <View style={StyleSheet.absoluteFill}>{LabelOverlays}</View>
      {onPlusPress && onCenterPress && (
        <View style={[StyleSheet.absoluteFill, styles.centerWrapper]}>
          <Pressable
            onPress={onCenterPress}
            hitSlop={10}
            style={{
              zIndex: 100000,
              elevation: 100000,
              position: "absolute",
              width: 40,
              height: 40,
              top: "50%",
              left: "50%",
              // backgroundColor: "red",
              borderRadius: 999,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          />
          {/* 
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "orange" },
            ]}
          >
            {RenderLeaves}
          </View> */}

          <MaterialCommunityIcons
            style={{ paddingTop: 30, opacity: 0.2, zIndex: 0 }}
            name={"leaf"}
            size={180}
            color={color}
          />

          <Pressable
            onPress={onPlusPress}
            style={[
              styles.centerButton,
              { backgroundColor: manualGradientColors.lightColor },
            ]}
            hitSlop={10}
          >
            <MaterialCommunityIcons
              name={"lightning-bolt-outline"} //pencil-plus
              name={"playlist-plus"}
              size={25}
              color={manualGradientColors.homeDarkColor}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
  },
  centerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    position: "absolute",
    padding: 6,
    borderRadius: 999,
    backgroundColor: "green",
    zIndex: 3,
    top: 160,
    right: 86,
  },
});

export default DonutChart;
