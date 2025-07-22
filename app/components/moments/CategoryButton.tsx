import { TouchableOpacity, Text, Pressable } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, { SharedValue } from "react-native-reanimated";

import { useFriendList } from "@/src/context/FriendListContext";
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
  viewableItemsArray: SharedValue[],
  label: Label;
  onPress: (label: Label) => void;
  height: number;
  pulseDuration: number;
}

const CategoryButton = ({
  
  viewableItemsArray,
  label,
  onPress,
  
  height = 30,
  pulseDuration = 2000,
}: Props) => {
  const {
    themeStyles, 
    appContainerStyles,
    appFontStyles,
    manualGradientColors,
  } = useGlobalStyle();

  const { themeAheadOfLoading } = useFriendList();
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
  useAnimatedReaction(
    () => {
      return Boolean(
        viewableItemsArray?.value[0]?.item?.user_category_name === label
      );
    },
    (isVisible, prevIsVisible) => {
      if (isVisible !== prevIsVisible) {
        if (isVisible) {
          startColor.value = themeAheadOfLoading.darkColor;
          endColor.value = manualGradientColors.lighterLightColor || "red";
          textColor.value = manualGradientColors.homeDarkColor;

          progress.value = withRepeat(
            withTiming(1, { duration: pulseDuration }),
            -1,
            true
          ); 
        } else {
          progress.value = withTiming(0, { duration: 200 });
          translateYx2.value = withTiming(0, { duration: 200 });
          startColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
          endColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
          textColor.value = themeStyles.genericText.color;
        }
      }
    },
    [viewableItemsArray]
  );

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
      style={[animatedCardsStyle, appContainerStyles.categoryButton, {  width: 'auto', padding: 10,  backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor, height: height}]}
      onPress={() => {
        onPress(label);
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          appFontStyles.categoryButtonText,
          themeStyles.genericText,
          animatedCardsStyle,
        ]}
      >
        # {label}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
};

export default CategoryButton;
