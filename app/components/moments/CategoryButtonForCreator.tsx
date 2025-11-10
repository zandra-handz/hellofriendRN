import { Pressable, StyleSheet } from "react-native";
import React, { useMemo, useEffect } from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

interface Label {
  label: string;
}

type Props = {
  viewableItemsArray: SharedValue[];
  selectedId: number;
  label: Label;
  itemId: number;
  onPress: (label: Label) => void;
  height: number;
  pulseDuration: number;
  highlightColor: string;
};

const CategoryButtonForCreator = ({
  primaryColor,
  label,
  itemId,
  onPress,
  selectedId,
  height = 30,
  pulseDuration = 1000,
  highlightColor = "#ccc",
}: Props) => {
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable);

  const progress = useSharedValue(0);
  const startColor = useSharedValue("transparent");
  const endColor = useSharedValue("red");

  // const textColor = useMemo(() => {
  //   if (!selectedId || !itemId) {
  //     return primaryColor
  //   }
  //   if (Number(selectedId) === Number(itemId)) {
  //     return manualGradientColors.homeDarkColor
  //   } else {
  //     return primaryColor
  //   }
  // },[primaryColor, selectedId, itemId]);


  const borderColor = useMemo(() => {
    if ( Number(selectedId) === Number(itemId)) {
      return highlightColor;
    } else {
      return 'transparent'
    }
  },[selectedId, itemId]);
  

  const textColor = primaryColor;

  useEffect(() => {
    if (!selectedId || !itemId) {
      return;
    }
    const isSelected = Number(selectedId) === Number(itemId);
    if (isSelected) {
      startColor.value = highlightColor;
      endColor.value = primaryColor || "red";

      progress.value = withRepeat(
        withTiming(1, { duration: pulseDuration }),
        -1,
        true
      );
    } else {
      progress.value = withTiming(0, { duration: 200 });
      startColor.value = "transparent";
      endColor.value = "transparent";
    }
  }, [selectedId, itemId]);

  const scaleValue = useSharedValue(1);
  const handleOnPressIn = () => {
    console.log("pressin");
    scaleValue.value = withTiming(0.75, { duration: 100 });
  };

  const handleOnPressOut = () => {
    console.log("press out");
    scaleValue.value = withTiming(1, { duration: 0 });
  };

  const handleOnPress = () => {
    console.log("on press");
    onPress(label);
    scaleValue.value = withTiming(1, { duration: 0 });
  };

  // const animatedCardsStyle = useAnimatedStyle(() => {
  //   const backgroundColor = interpolateColor(
  //     progress.value,
  //     [0, 1],
  //     [startColor.value, endColor.value]
  //   );

  //   return {
  //     // backgroundColor,
  //     borderWidth: 2,
  //     borderColor: backgroundColor,
  //     transform: [
  //       { scale: scaleValue.value },
  //     ],
  //   };
  // });

  return (
    <AnimatedTouchableOpacity
      style={[
        // animatedCardsStyle,
        styles.categoryButton,

        {
          height: height,
          borderWidth: 2,
          borderColor: borderColor,
        },
      ]}
      onPress={handleOnPress}
      onPressIn={() => {
        handleOnPressIn();
      }}
      onPressOut={() => {
        handleOnPressOut();
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.label,

          {
            color: textColor,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    width: "auto",
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 10,

    borderRadius: 16,
    height: "auto",
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    height: "100%",
    alignSelf: "center",
    borderRadius: 999,
    padding: 2,
  },
});

export default CategoryButtonForCreator;
