import { View, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { SharedValue, useDerivedValue, runOnJS } from "react-native-reanimated";
import {
  BlurMaskFilterProps,
  Canvas,
  Path,
  SkFont,
  Skia,
  Text,
} from "@shopify/react-native-skia";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import DonutPath from "./DonutPath";
import { Text as RNText } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  onCategoryPress: () => void;
  onCenterPress: () => void;
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  font: SkFont;
  smallFont: SkFont;
  color: string;
  backgroundColor: string;
  totalValue: SharedValue<number>;
  n: number;
  gap: number;
  labelsValue: SharedValue<object[]>;
  labelsJS: object[];
  decimalsValue: SharedValue<number[]>;
  colors: string[];
  labelsSize: number;
  labelsDistanceFromCenter: number;
  labelsSliceEnd: number;
};

const DonutChart = ({
  onCategoryPress,
  onCenterPress,
  radius,
  strokeWidth,
  outerStrokeWidth,
  color,
  backgroundColor,
  font,
  smallFont,
  totalValue,
  n,
  gap,
  decimalsValue,
  labelsValue,
  colors,
  labelsSize,
  labelsDistanceFromCenter,
  labelsSliceEnd,
}: Props) => {
  const array = Array.from({ length: n });
  const innerRadius = radius - outerStrokeWidth / 2;

  const [labelsJS, setLabelsJS] = useState([]);
  const [decimalsJS, setDecimalsJS] = useState([]);

  useDerivedValue(() => {
    const labelsSnapshot = labelsValue.value;
    runOnJS(setLabelsJS)(labelsSnapshot);
  }, [labelsValue]);

  useDerivedValue(() => {
    const decimalsSnapshot = decimalsValue.value;
    runOnJS(setDecimalsJS)(decimalsSnapshot);
  }, [decimalsValue]);

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(
    () => `${Math.round(totalValue.value)}`,
    []
  );
  // console.log(`n in donut chart: `, n);

  const fontSize = font.measureText("$0");
  const smallFontSize = smallFont.measureText("Total");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 1.8;
  });

  const LabelOverlays = array.map((_, index) => {
    // const label = labelsValue.value[index]?.name || "";
    // const decimal = decimalsValue.value[index];

    const categoryLabel = labelsJS[index]?.name || "";
    const categoryId = labelsJS[index]?.user_category || "";
    const categoryIndex = index + 1;
    const decimal = decimalsJS[index];
    if (!decimal) return null;

    const centerX = radius;
    const centerY = radius;

    // const start = decimalsValue.value
    const start = decimalsJS.slice(0, index).reduce((acc, v) => acc + v, 0);
    const end = start + decimal;

    const midAngle = ((start + end) / 2) * 2 * Math.PI;
    const labelRadius = radius + labelsDistanceFromCenter;

    const x = centerX + labelRadius * Math.cos(midAngle);
    const y = centerY + labelRadius * Math.sin(midAngle);

    return (
      <Pressable
        onPress={() => onCategoryPress(categoryId)}
        key={index}
        style={{
          //  backgroundColor: color,
          padding: 4,
          borderRadius: 4,
          position: "absolute",
          left: x,
          top: y,
          transform: [{ translateX: -10 }, { translateY: -10 }],
        }}
      >
        <RNText
          style={{
            color: color,
            fontSize: labelsSize,
            fontFamily: "Poppins-Regular",
          }}
        >
          {categoryLabel.slice(0, labelsSliceEnd)}
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
        {/* {array.map((_, index) => {
          return <DonutPath key={index}
          radius={radius}
          strokeWidth={strokeWidth}
          outerStrokeWidth={outerStrokeWidth}
          color={colors[index]}
          decimalsValue={decimalsValue}
          index={index}
          gap={gap}
          
          
          />;
        })} */}

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
              {/* {label && (
                <Text
                  x={x}
                  y={y}
                  text={label}
                  font={smallFont}
                  color={colors[index]}
                />
              )} */}
            </React.Fragment>
          );
        })}

        {/* <Text
          x={radius - smallFontSize.width / 3}
          y={radius + smallFontSize.height / 3 - fontSize.height / 2.2}
          text={"Total"}
     
          font={smallFont}
          color={color}
        /> */}
        <Text
          x={textX}
          y={radius + fontSize.height / 2.4}
          text={targetText}
          font={font}
          color={color}
        />
      </Canvas>
      <View style={StyleSheet.absoluteFill}>{LabelOverlays}</View>
      {onCenterPress && (
        
      <View style={[StyleSheet.absoluteFill, styles.centerWrapper]}>
        <Pressable
          onPress={onCenterPress}
          style={[styles.centerButton, {}]}
          hitSlop={10}
        >
          <MaterialCommunityIcons name={"plus"} size={40} color={color} />
          {/* <RNText style={{ color, fontFamily: "Poppins-Bold", fontSize: 16 }}>
          Add
        </RNText> */}
        </Pressable>
      </View>
      
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    padding: 12,
    borderRadius: 999,
    // backgroundColor: "white",
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    top: 26,
    right: -26,
  },
});

export default DonutChart;
