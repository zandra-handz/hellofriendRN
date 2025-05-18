import { TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated from "react-native-reanimated";

import { useFriendList } from "@/src/context/FriendListContext";
import {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

const CategoryButton = ({
  viewableItemsArray,
  label,
  onPress,
  pulseDuration = 2000,
}) => {
  const {
    themeStyles,
    gradientColors,
    appContainerStyles,
    appFontStyles,
    manualGradientColors,
  } = useGlobalStyle();

  const { themeAheadOfLoading } = useFriendList();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const momentBackgroundColor = gradientColors.lightColor;
  const progress = useSharedValue(0);
  const translateYx2 = useSharedValue(0);
  const startColor = useSharedValue("transparent");
  const endColor = useSharedValue("red");
  const textColor = useSharedValue(themeStyles.genericText.color);

  //  show animation based on if top item in FlatList in parent
  useAnimatedReaction(
    () => {
      return Boolean(
        viewableItemsArray?.value[0]?.item?.typedCategory === label
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

          // translateYx2.value = withRepeat(
          //   withSequence(
          //     withTiming(-bobbingDistance, { duration: bobbingDuration }),
          //     withTiming(0, { duration: bobbingDuration })
          //   ),
          //   -1,
          //   false
          // );
        } else {
          progress.value = withTiming(0, { duration: 200 });
          translateYx2.value = withTiming(0, { duration: 200 });
          startColor.value = "transparent";
          endColor.value = "transparent";
          textColor.value = themeStyles.genericText.color;
        }
      }
    },
    [viewableItemsArray]
  );

  const animatedCardsStyle = useAnimatedStyle(() => {
    // console.log(`IN CAT BUTTON`, viewableItemsArray?.value[0]?.item);

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
      style={[animatedCardsStyle, appContainerStyles.categoryButton]}
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
