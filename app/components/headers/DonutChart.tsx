import { View, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  withDelay,
  withTiming,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import {
  Canvas,
  Path,
  SkFont,
  Skia,
  Text,
  Group,
} from "@shopify/react-native-skia"; 
import SvgIcon from "@/app/styles/SvgIcons";
import DonutPath from "./DonutPath";
import { Text as RNText } from "react-native";
import LeafPath from "./LeafPath";
import manualGradientColors from "@/app/styles/StaticColors";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

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
  positionsValue,
  positions,
  primaryColor,
  darkerOverlayBackgroundColor,
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
  labelsValue,
  lastFlush,
  resetLeaves,
  colors,
  labelsSize,
  labelsDistanceFromCenter,
  labelsSliceEnd,
}: Props) => {
  const array = Array.from({ length: n });
  const innerRadius = radius - outerStrokeWidth / 2;

  const [labelsJS, setLabelsJS] = useState([]);
  const [decimalsJS, setDecimalsJS] = useState([]);

  const fadeInValue = useSharedValue(0);
  const LabelOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInValue.value,
      zIndex: 4,
    };
  }, [fadeInValue]);

  useEffect(() => {
    if (!totalJS) {
      return;
    }

    fadeInValue.value = withDelay(
      // totalJS * 20,
      0,
      withTiming(1, { duration: 500 })
    );
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

  // const friendIdValue = useSharedValue(selectedFriend?.id ?? -1);

  // useEffect(() => {
  //   // Update shared value whenever selectedFriend changes
  //   friendIdValue.value = selectedFriend?.id ?? -1;
  // }, [selectedFriend?.id]);

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

    // console.log(colors);

    return (
      <Pressable
        onPress={() => onCategoryPress(categoryLabel)}
        key={index}
        style={({ pressed }) => [
          styles.categoryLabelsContainer,
          {
            left: x,
            top: y,
            transform: [
              { translateX: -textWidth / 2 },
              { translateY: -textHeight / 2 },
              ...(pressed ? [{ scale: 0.97 }] : []),
            ],
            backgroundColor: pressed ? "#ddd" : "transparent",
            shadowOpacity: pressed ? 0.3 : 0,
            zIndex: 66666,
            elevation: 66666,
            position: "absolute",
            padding: 4,
            borderRadius: 10,
          },
        ]}
      >
        <RNText
          style={[
            styles.RNText,
            {
              color: color,
              fontSize: labelsSize,
              backgroundColor: darkerOverlayBackgroundColor,
            },
          ]}
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

          <LeafPath
            lastFlush={lastFlush}
            totalJS={totalJS}
            positionsValue={positionsValue}
            positions={positions}
            count={targetText}
            totalValue={totalValue}
            decimals={decimalsValue}
            categoryStops={categoryStopsValue}
            centerX={radius - labelsSize - 40} // WEIRD EYEBALL
            centerY={radius - labelsSize - 40} // WEIRD EYEBALL
            radius={radius / 4}
            size={24}
            colors={colors}
          />

          <Text
            x={textX}
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

      <Pressable
        onPress={() => resetLeaves()}
        style={{
          width: 40,
          height: 40,
          position: "absolute",
          borderRadius: 999,
          zIndex: 10000,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: "hotpink",
        }}
      >
        <SvgIcon
        name="refresh"
        color={primaryColor}
        size={24}/>
      </Pressable>
      {onPlusPress && onCenterPress && (
        <View style={[StyleSheet.absoluteFill, styles.centerWrapper]}>
          <SvgIcon
            name={"leaf"}
            style={{ paddingTop: 30, opacity: 0.1, zIndex: 0 }}
            size={200}
            color={color}
          />

          <Pressable
            onPress={onCenterPress}
            hitSlop={10}
            style={styles.centerCenterButton}
          />
        </View>
      )}
      <Pressable
        onPress={onPlusPress}
        hitSlop={60}
        style={[
          styles.centerButton,
          {
            backgroundColor: manualGradientColors.lightColor,
          },
        ]}
        hitSlop={30}
      >
        <SvgIcon
          name={"plus"}
          size={22}
          opacity={1}
          color={primaryColor}
          color={manualGradientColors.homeDarkColor}
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
  categoryLabelsContainer: {
    zIndex: 66666,
    elevation: 66666,
    position: "absolute",
    padding: 4,
    borderRadius: 10,
  },
  centerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerCenterButton: {
    zIndex: 1000000,
    elevation: 1000000,
    position: "absolute",
    width: 130,
    height: 130,

    top: "50%",
    left: "50%",
    // backgroundColor: "red",
    borderRadius: 999,
    transform: [{ translateX: -70 }, { translateY: -70 }], // BASED ON CIRCLE DIAMETER
  },
  centerButton: {
    position: "absolute",
    padding: 0,

    zIndex: 1000000,
    elevation: 1000000,
    backgroundColor: "red",
    //borderRadius: 999,
    borderRadius: 0,
    // zIndex: 2,

    right: -10,
    bottom: 30,
    zIndex: 2,
    borderRadius: 999,
    width: 34,
    height: 34,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  RNText: {
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",

    alignSelf: "center",
    padding: 4,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});

export default DonutChart;
