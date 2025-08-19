import { TouchableOpacity  } from "react-native";
import React, {  useEffect } from "react"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, { SharedValue } from "react-native-reanimated";
 
import {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
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
  label,
  itemId,
  onPress,
  selectedId,
  height = 30,
  pulseDuration = 2000,
  highlightColor = "#ccc",
}: Props) => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    manualGradientColors,
  } = useGlobalStyle();
   
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  // not sure how to add animations to Pressable
  //   const AnimatedPressable =
  // Animated.createAnimatedComponent(Pressable);

  const progress = useSharedValue(0);
  const translateYx2 = useSharedValue(0);
  const startColor = useSharedValue("transparent");
  const endColor = useSharedValue("red");
  const textColor = useSharedValue(themeStyles.genericText.color);

  //  show animation based on if top item in FlatList in parent
  // useAnimatedReaction(
  //   () => {
  //     return Boolean(selectedId === label);
  //   },
  //   (isVisible, prevIsVisible) => {
  //     if (isVisible !== prevIsVisible) {
  //       if (isVisible) {
  //         // startColor.value = themeAheadOfLoading.darkColor;
  //         startColor.value = highlightColor;
  //         // endColor.value = manualGradientColors.lighterLightColor || "red";
  //         endColor.value = themeStyles.primaryText.color || "red";
  //         textColor.value = manualGradientColors.homeDarkColor;

  //         progress.value = withRepeat(
  //           withTiming(1, { duration: pulseDuration }),
  //           -1,
  //           true
  //         );
  //       } else {
  //         progress.value = withTiming(0, { duration: 200 });
  //         translateYx2.value = withTiming(0, { duration: 200 });
  //         startColor.value = "transparent";
  //         endColor.value = "transparent";
  //         // startColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
  //         // endColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
  //         textColor.value = themeStyles.genericText.color;
  //       }
  //     }
  //   },
  //   [selectedId]
  // );

  useEffect(() => {
    if (!selectedId || !itemId) {
      return;
    } 
    const isSelected = Number(selectedId) === Number(itemId);
            if (isSelected) {
          // startColor.value = themeAheadOfLoading.darkColor;
          startColor.value = highlightColor;
          // endColor.value = manualGradientColors.lighterLightColor || "red";
          endColor.value = themeStyles.primaryText.color || "red";
          textColor.value = manualGradientColors.homeDarkColor;

          progress.value = withRepeat(
            withTiming(1, { duration: pulseDuration }),
            -1,
            true
          );
        } else {
          progress.value = withTiming(0, { duration: 200 });
          translateYx2.value = withTiming(0, { duration: 200 });
          startColor.value = "transparent";
          endColor.value = "transparent";
          // startColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
          // endColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
          textColor.value = themeStyles.genericText.color;
        }



  }, [selectedId, itemId]);

  const animatedCardsStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [startColor.value, endColor.value]
    );

    return {
      backgroundColor,
      color: textColor.value,
      transform: [{ translateY: translateYx2.value }],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedCardsStyle,
        appContainerStyles.categoryButton,
        {
          width: "auto",
          padding: 10,
          //  backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          height: height,
        },
      ]}
      onPress={() => {
        onPress(label);
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          animatedCardsStyle,
          themeStyles.genericText,
          // animatedCardsStyle,
          {
            // fontWeight: "bold",
            fontSize: 14,
            fontFamily: "Poppins-Bold",
            fontWeight: "bold",
            //   textTransform: "uppercase",
            height: "100%",
            alignSelf: "center",

            //  backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
            borderRadius: 999,
            padding: 2,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
};

export default CategoryButtonForCreator;
