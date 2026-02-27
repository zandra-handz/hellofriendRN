import { View, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

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
  Rect,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import SvgIcon from "@/app/styles/SvgIcons";

import NotDonutPath from "./NotDonutPath";
import { Text as RNText } from "react-native";

import DotPaths from "./DotPaths";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

// import { useFriendDash } from "@/src/context/FriendDashContext";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

type Props = {
  onCategoryPress: () => void;
  onCategoryLongPress: () => void;
  onCenterPress: () => void;
  // onPlusPress: () => void;
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
  catN: number;
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

const DotsCanvas = ({
  canvasKey,
  totalJS,
  positions,
  canvasWidth,
  onCategoryPress,
  catDecimalsValue,
  // colorsReversed,
  // colors,
  // onPlusPress,  key={canvasKey}
  onCenterPress,
  // categoryStopsValue,
  radius,
  // strokeWidth,
  outerStrokeWidth,
  darkerOverlayBackgroundColor,
  backgroundColor,
  // font,
  // totalValue,
  n,
  catN,
  // gap,
  decimalsValue,
  labelsValue,
  color,

  // colors,
  labelsSize,
  labelsDistanceFromCenter,
  labelsSliceEnd,
  coloredDotsModeValue,
  canvasHeight,
  heightFull,
}: Props) => {
  // const { lightDarkTheme } = useLDTheme();
  const array = Array.from({ length: n });
  const catArray = Array.from({ length: catN });
  const innerRadius = radius - outerStrokeWidth / 2;
  // const color = lightDarkTheme.primaryText;
  const { selectedFriend } = useSelectedFriend();

  const [labelsJS, setLabelsJS] = useState([]);
  const [decimalsJS, setDecimalsJS] = useState([]);
  const [catDecimalsJS, setCatDecimalsJS] = useState([]);

  useDerivedValue(() => {
  runOnJS(setCatDecimalsJS)(catDecimalsValue.value);
}, [catDecimalsValue]);

  const [coloredDotsMode, setColoredDotsMode] = useState(false);

  useDerivedValue(() => {
    runOnJS(setColoredDotsMode)(coloredDotsModeValue.value);
  }, [coloredDotsModeValue]);

  const fadeInValue = useSharedValue(0);

  const LabelOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInValue.value,
      zIndex: 4,
    };
  }, [fadeInValue]);

  // const [coloredDotsMode, setColoredDotsMode] = useState(false);

  const [highLightedColor, setHighlightedColor] = useState(null);
  const [highlightCatID, setHighlightID] = useState(null);
  const [highlightPosition, setHighlightPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);


  useEffect(() => {
  if (!coloredDotsMode) {
    setHighlightedColor(null);
    setHighlightID(null);
    setHighlightPosition(null);
  }
}, [coloredDotsMode]);
  // const handleToggleColoredDots = () => {

  //   setColoredDotsMode((prev) => !prev);
  // };

  useEffect(() => {
    if (!totalJS) {
      return;
    }

    fadeInValue.value = withDelay(
      // totalJS * 20,
      0,
      withTiming(1, { duration: 500 }),
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

  const friendIdValue = useSharedValue(selectedFriend?.id ?? -1);

  useEffect(() => {
    // Update shared value whenever selectedFriend changes
    friendIdValue.value = selectedFriend?.id ?? -1;
  }, [selectedFriend?.id]);

  // const LabelOverlays = catArray.map((_, index) => {
  //   const categoryLabel = labelsJS[index]?.name || "";
  //   // const categoryId = labelsJS[index]?.user_category || "";
  //   const decimal = decimalsJS[index];
  //   if (!decimal) return null;

  //   const centerX = radius;
  //   const centerY = radius;

  //   const start = decimalsJS.slice(0, index).reduce((acc, v) => acc + v, 0);

  //   const end = start + decimal;

  //   const midAngle = ((start + end) / 2) * 2 * Math.PI;
  //   const labelRadius = radius + labelsDistanceFromCenter;

  //   const x = centerX + labelRadius * Math.cos(midAngle);
  //   const y = centerY + labelRadius * Math.sin(midAngle);

  //   const labelText = categoryLabel.slice(0, labelsSliceEnd);

  //   const approxCharWidth = labelsSize * 0.55; // works well for Poppins-Regular
  //   const textWidth = labelText.length * approxCharWidth;
  //   const textHeight = labelsSize;

  //   // console.log(colors);

  //   return (
  //     <Pressable
  //       onPress={() => onCategoryPress(categoryLabel)}
  //       key={index}
  //       style={({ pressed }) => [
  //         styles.categoryLabelsContainer,
  //         {
  //           left: x,
  //           top: y,
  //           transform: [
  //             { translateX: -textWidth / 1.4 },
  //             { translateY: -textHeight / 1 }, // /2
  //             ...(pressed ? [{ scale: 0.7 }] : [{ scale: 1 }]),
  //           ],
  //           backgroundColor: pressed ? "#ddd" : "transparent",
  //           shadowOpacity: pressed ? 0.2 : 0,
  //         },
  //       ]}
  //     >
  //       <RNText
  //         style={[
  //           styles.RNText,
  //           {
  //             color: color,
  //             fontSize: labelsSize,
  //             backgroundColor: darkerOverlayBackgroundColor,
  //             paddingVertical: 6,
  //           },
  //         ]}
  //       >
  //         {labelText}
  //       </RNText>
  //     </Pressable>
  //   );
  // });

  const onDotDoublePress = () => {
    console.log("doulbe press!");
  };
  const onDotPress = useCallback((hit) => {
    if (hit) {
      setHighlightID(hit.catId);
      setHighlightedColor(hit.color);
      setHighlightPosition({ x: hit.x, y: hit.y });
    } else {
      setHighlightID(null);
      setHighlightedColor(null);
      setHighlightPosition(null);
    }
  }, []);

  const tap = Gesture.Tap()
    .enabled(coloredDotsMode)
    .numberOfTaps(1)
    .onStart(({ x, y }) => {
      const hit = positions.find((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 20;
      });
      if (hit) runOnJS(onDotPress)(hit);
    });

  const doubleTap = Gesture.Tap()
    .enabled(coloredDotsMode)
    .numberOfTaps(2)
    .onStart(({ x, y }) => {
      const hit = positions.find((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 20;
      });
      if (hit) runOnJS(onDotDoublePress)(hit);
    });

  // Compose them - single tap waits to confirm it's not a double tap
  const gesture = Gesture.Exclusive(doubleTap, tap);

  return (
    <View
      style={[
        styles.container,
        { height: coloredDotsMode ? heightFull : canvasHeight },
      ]}
    >
      <GestureDetector gesture={gesture}>
        <Canvas
          key={canvasKey}
          style={[
            styles.canvasContainer,
            {
              // width: radius * 2 + 40 + 20 + 10,
              width: canvasWidth, // full screen width
              height: canvasHeight,
              // backgroundColor: 'pink'
              // width: radius * 2 + 40 + 20, // the + 40 here just adds space on the left without changing the position of the chart for the total text
              // height: radius * 2 + 20,
            },
          ]}
        >
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            color={backgroundColor}
          />
          <DotPaths
            // key={selectedFriend?.id ?? "no-friend"}
            positions={positions}
            // colorsReversed={colorsReversed}
            // colors={colors}
            useColors={coloredDotsMode}
            highlightColor={highLightedColor}
            highlightCatID={highlightCatID}
          />

          <Group transform={[{ translateX: 5 }, { translateY: 5 }]}>
            {/* <Path
                path={path}
                color={backgroundColor}
                style={"stroke"}
                strokeWidth={outerStrokeWidth}
                strokeCap="round"
                strokeJoin="round"
                start={0}
                end={1}
              /> */}

            {/* {array.map((_, index) => {
            return (
              <React.Fragment key={index}>
                <NotDonutPath
                  // key={selectedFriend?.id ?? "no-friend"}
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
          })}  */}
            {/* <Text
            x={textX}
            y={300}
            text={targetText}
            font={font}
            color={color}
            opacity={1}
          /> */}
          </Group>
        </Canvas>
      </GestureDetector>
{coloredDotsMode && (
  <View style={{
    width: canvasWidth,
    height: 250,
    // backgroundColor: "lightblue",
    paddingVertical: 60,
    paddingHorizontal: 10,
    marginTop: 10,
  }}>
    {[...labelsJS.map((label, index) => ({ label, decimal: catDecimalsJS[index] ?? 0 }))]
  .sort((a, b) => b.decimal - a.decimal)
  .map(({ label, decimal }, index) => {
    const percentage = decimal ? Math.round(decimal * 100) : 0;
    const isHighlighted = label.user_category === highlightCatID;

    return (
      <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <RNText style={{ 
          color: isHighlighted ? highLightedColor : color, 
          lineHeight: 30,  
          opacity: isHighlighted ? 1 : 0.8, 
          fontFamily: 'Poppins-Regular', 
          fontSize: 13 
        }}>
          {label.name}
        </RNText>
        <RNText style={{ 
          color: isHighlighted ? highLightedColor : color, 
          lineHeight: 30, 
          opacity: isHighlighted ? 1 : 0.8, 
          fontFamily: 'Poppins-Regular', 
          fontSize: 18 
        }}>
          {percentage}%
        </RNText>
      </View>
    );
  })}
{/* {labelsJS.map((label, index) => {
  const decimal = catDecimalsJS[index];
  const percentage = decimal ? Math.round(decimal * 100) : 0;
  const isHighlighted = label.user_category === highlightCatID;

  return (
    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <RNText style={{ 
        color: isHighlighted ? highLightedColor : color, 
        lineHeight: 30,  
        opacity: isHighlighted ? 1 : 0.8, 
        fontFamily: 'Poppins-Regular', 
        fontSize: 13 
      }}>
        {label.name}
      </RNText>
      <RNText style={{ 
        color: isHighlighted ? highLightedColor : color, 
        lineHeight: 30, 
        opacity: isHighlighted ? 1 : 0.8, 
        fontFamily: 'Poppins-Regular', 
        fontSize: 18 
      }}>
        {percentage}%
      </RNText>
    </View>
  );
})} */}
  </View>
)}
      {/* )} */}

      {coloredDotsMode &&
        highlightCatID !== null &&
        highlightPosition &&
        (() => {
          const isLeftSide = highlightPosition.x < canvasWidth / 2;
          const labelText =
            labelsJS.find((l) => l.user_category === highlightCatID)?.name ??
            "";
          const approxWidth = labelText.length * 7 + 16; // +16 for paddingHorizontal * 2

          return (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left:
                  highlightPosition.x + (isLeftSide ? 8 : -(approxWidth + 8)),
                top: highlightPosition.y - 14,
                borderWidth: 2,
                borderColor: highLightedColor,
                backgroundColor: darkerOverlayBackgroundColor,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 30,
                zIndex: 999999,
              }}
            >

              <RNText
                style={{
                  color: color,
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                }}
              >
                {labelText}
              </RNText>
            </View>
          );
        })()}

      {onCenterPress && !coloredDotsMode && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 200000,
    alignItems: "center", // add this
    // backgroundColor: 'red'
  },
  canvasContainer: {
    // flex: 1,
    zIndex: 200000,

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
    // backgroundColor: "red",
    //borderRadius: 999,
    borderRadius: 0,
    // zIndex: 2,

    right: -10,
    bottom: 30,
    zIndex: 2,
    borderRadius: 999,
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  RNText: {
    fontFamily: "Poppins-Regular",
    // fontWeight: "bold",

    alignSelf: "center",
    padding: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
});

export default DotsCanvas;
