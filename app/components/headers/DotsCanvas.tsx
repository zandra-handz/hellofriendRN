import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import useDoublePress from "../buttons/useDoublePress";
import CategoryTooltip from "./CategoryTooltip";

import Animated, {
  withDelay,
  withTiming,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { Canvas, SkFont, Group, Rect } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Text as RNText } from "react-native";

import DotPaths from "./DotPaths";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  onCategoryPress: () => void;
  onCategoryLongPress: () => void;
  onCenterPress: () => void;
  // onPlusPress: () => void;
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
  onCenterPress,
  onCenterSinglePress,
  darkerOverlayBackgroundColor,
  backgroundColor,

  labelsValue,
  color,

  coloredDotsModeValue,
  canvasHeight,
  heightFull,
}: Props) => {
  const { selectedFriend } = useSelectedFriend();
  const isFocused = useIsFocused();
  const { handleDoublePress } = useDoublePress({
    // onSinglePress: handleToggleColoredDots,
    onSinglePress: onCenterSinglePress,
    onDoublePress: onCenterPress,
  });

  const [labelsJS, setLabelsJS] = useState([]);
  // const [decimalsJS, setDecimalsJS] = useState([]);
  const [catDecimalsJS, setCatDecimalsJS] = useState([]);

  useDerivedValue(() => {
    runOnJS(setCatDecimalsJS)(catDecimalsValue.value);
  }, [catDecimalsValue]);

  const [coloredDotsMode, setColoredDotsMode] = useState(false);

  useDerivedValue(() => {
    runOnJS(setColoredDotsMode)(coloredDotsModeValue.value);
  }, [coloredDotsModeValue]);

  const fadeInValue = useSharedValue(0);

  const CATEGORY_CONTAINER_HEIGHT = 300;

  const sortedCategories = useMemo(() => {
    if (!labelsJS.length || !catDecimalsJS.length) return [];
    return labelsJS
      .map((label, index) => ({
        label,
        decimal: catDecimalsJS[index] ?? 0,
      }))
      .sort((a, b) => b.decimal - a.decimal);
  }, [labelsJS, catDecimalsJS]);

  // const LabelOverlayStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: fadeInValue.value,
  //     zIndex: 4,
  //   };
  // }, [fadeInValue]);

  const [highLightedColor, setHighlightedColor] = useState(null);
  const [highlightCatID, setHighlightID] = useState(null);
  const [highlightPosition, setHighlightPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const lastSelectedCatId = useRef(null);

  useEffect(() => {
    if (!coloredDotsMode) {
      setHighlightedColor(null);
      setHighlightID(null);
      setHighlightPosition(null);
    } else if (sortedCategories.length > 0 && positions.length > 0) {
      const targetCatId =
        lastSelectedCatId.current ?? sortedCategories[0].label.user_category;
      const hit = positions.find((p) => p.catId === targetCatId);
      if (hit) onDotPress(hit);
    }
  }, [coloredDotsMode, sortedCategories]);

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

  const friendIdValue = useSharedValue(selectedFriend?.id ?? -1);


const handleCategoryPress = useCallback((label) => {
  lastSelectedCatId.current = label.user_category;
  const hit = positions.find((p) => p.catId === label.user_category);
  if (hit) onDotPress(hit);
  onCategoryPress(label.name);
}, [onCategoryPress, positions, onDotPress]);

  useEffect(() => {
    // Update shared value whenever selectedFriend changes
    friendIdValue.value = selectedFriend?.id ?? -1;
  }, [selectedFriend?.id]);

  const onDotDoublePress = useCallback((hit) => {
    if (hit) {
    }
    console.log("doulbe press!");
  }, []);

  const onDotPress = useCallback((hit) => {
    if (hit) {
      console.log("single press!");
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
        // { height: coloredDotsMode ? heightFull : canvasHeight },
        { height: heightFull },
      ]}
    >
      {isFocused && (
        <GestureDetector gesture={gesture}>
          <Canvas
            key={canvasKey}
            style={[
              styles.canvasContainer,
              {
                width: canvasWidth, // full screen width
                height: canvasHeight,
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
              positions={positions}
              useColors={coloredDotsMode}
              highlightColor={highLightedColor}
              highlightCatID={highlightCatID}
            />

            <Group transform={[{ translateX: 5 }, { translateY: 5 }]}></Group>
          </Canvas>
        </GestureDetector>
      )}
      {coloredDotsMode && (
        <View
          style={[
            styles.percentagesOutContainer,
            {
              height: CATEGORY_CONTAINER_HEIGHT,
              width: canvasWidth,
            },
          ]}
        >
          <ScrollView>
            {sortedCategories.map(({ label, decimal }, index) => {
              const percentage = decimal ? Math.round(decimal * 100) : 0;
              const isHighlighted = label.user_category === highlightCatID;

              return (
                <View key={index} style={styles.percentagesRow}>
                  <RNText
                 onPress={() => handleCategoryPress(label)}
                    style={{
                      color: isHighlighted ? highLightedColor : color,
                      lineHeight: 30,
                      opacity: isHighlighted ? 1 : 0.8,
                      fontFamily: "Poppins-Regular",
                      fontSize: 13,
                    }}
                  >
                    {label.name}
                  </RNText>
                  <RNText
                    style={{
                      color: isHighlighted ? highLightedColor : color,
                      lineHeight: 30,
                      opacity: isHighlighted ? 1 : 0.8,
                      fontFamily: "Poppins-Regular",
                      fontSize: 18,
                    }}
                  >
                    {percentage}%
                  </RNText>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
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
            <CategoryTooltip
              label={labelText}
              color={color}
              onPress={onCategoryPress}
              borderColor={highLightedColor}
              backgroundColor={darkerOverlayBackgroundColor}
              containerStyle={{
                position: "absolute",
                left:
                  highlightPosition.x + (isLeftSide ? 8 : -(approxWidth + 8)),
                top: highlightPosition.y - 14,
                zIndex: 999999,
              }}
            />
          );
        })()}

      {handleDoublePress && !coloredDotsMode && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.centerWrapper,
            { height: canvasHeight },
          ]}
        >
          <Pressable
            onPress={handleDoublePress}
            hitSlop={10}
            style={styles.buttonArea}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2, // was 200000
    alignItems: "center",
  },
  canvasContainer: {
    zIndex: 2, // was 200000
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
    flex: 1,
    height: "100%",
  },
  buttonArea: {
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

    zIndex: 1000000,
    elevation: 1000000,

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

    alignSelf: "center",
    padding: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  percentagesOutContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  percentagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});

export default DotsCanvas;
