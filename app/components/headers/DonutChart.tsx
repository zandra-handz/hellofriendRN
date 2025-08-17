import { View, StyleSheet, Pressable } from "react-native";
import React, {  useEffect, useState } from "react";
import Animated, {
  withDelay,
  withTiming,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import {
  Canvas,
  Path,
  SkFont,
  Skia,
  Text,
  Group,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import DonutPath from "./DonutPath";
import { Text as RNText } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  totalJS,
  onCategoryPress,
  onPlusPress,
  onCenterPress,
  radius,
  strokeWidth,
  outerStrokeWidth,
  color,
  backgroundColor,
  font,
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
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const [labelsJS, setLabelsJS] = useState([]);
  const [decimalsJS, setDecimalsJS] = useState([]);


  const fadeInValue = useSharedValue(0);

  const LabelOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInValue.value,
      zIndex: 4,
    }

  }, [fadeInValue]);


  useEffect(() => {
    if (!totalJS) {
      return;
    } 
    

    fadeInValue.value = withDelay(totalJS * 80, withTiming(1, {duration: 500}));

  }, [totalJS]);

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
  const targetCategories = useDerivedValue(
    () => `${Math.round(categoryTotals.value)}`,
    []
  );
  // const fontSize = font.measureText("$0");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 1.8 + 170;
  });

  const LabelOverlays = array.map((_, index) => {
    const categoryLabel = labelsJS[index]?.name || "";
    // const categoryId = labelsJS[index]?.user_category || "";
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
            fontWeight: "bold",
            backgroundColor:
              themeStyles.darkerOverlayBackgroundColor.backgroundColor,

            alignSelf: "center",
            padding: 4,
            borderRadius: 4,
            paddingHorizontal: 10,
          }}
        >
          {labelText}
        </RNText>
      </Pressable>
    );
  });

  return (
    <View style={styles.container}>
      <Canvas
        style={[
          styles.canvasContainer,
          {
            width: radius * 2 + 40, // the + 40 here just adds space on the left without changing the position of the chart for the total text
            height: radius * 2,
          },
        ]}
      >
        <Group transform={[{ translateX: 0 }, { translateY: 0 }]}>
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

          {/* DONT DELETE MIGHT NEED 
        <Rect
          x={radius - 22}
          //  y={radius - 22}
          y={20}
          x={240}
          //  y={radius + fontSize.height / 3.4}
          y={270}
          width={fontSize.width}
          height={fontSize.height + 10}
          opacity={0.0}
          color={themeStyles.overlayBackgroundColor.backgroundColor} // your desired background color
          color={"pink"}
        /> */}

          <LeafPath
            count={targetText}
            decimals={decimalsValue}
            categoryStops={categoryStopsValue}
            categoryTotals={targetCategories}
            centerX={radius - labelsSize - 40} // WEIRD EYEBALL
            centerY={radius - labelsSize - 40} // WEIRD EYEBALL
            radius={radius / 4}
            size={24}
            colors={colors}
          />

          <Text
            x={textX}
            //  x={0}
          //  x={278}
            //  y={radius + fontSize.height / 3.4}
            y={300}
            text={targetText}
            font={font}
            color={color}
            opacity={1}
          />
        </Group>
      </Canvas>
      <Animated.View style={[LabelOverlayStyle, StyleSheet.absoluteFill]}>
        {LabelOverlays}
      </Animated.View>
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

          <MaterialCommunityIcons
            style={{ paddingTop: 30, opacity: 0.1, zIndex: 0 }}
            name={"leaf"}
            size={200}
            color={color}
          />
        </View>
      )}
      <Pressable
        onPress={onPlusPress}
        style={[
          styles.centerButton,
          // { backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor },
        ]}
        hitSlop={30}
      >
        <MaterialCommunityIcons
          name={"lightning-bolt-outline"} //pencil-plus
          // name={"playlist-plus"}
          name={"plus"}
          size={70}
          opacity={.2}
          color={themeStyles.primaryText.color}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
  },
  canvasContainer: {
    flex: 1,
    zIndex: 2,

   // backgroundColor: "pink",
  },
  centerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    position: "absolute",
    padding: 0,
    //borderRadius: 999,
    borderRadius: 4,
    zIndex: 2,

    right: -58,
    bottom: -20,
  },
});

export default DonutChart;
