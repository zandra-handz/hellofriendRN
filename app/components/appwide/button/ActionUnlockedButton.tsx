import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated from "react-native-reanimated";
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";
 
import {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

const ActionUnlockedButton = ({
  isUnlocked = true, 
  label,
  onPress,
  pulseDuration = 2000,
  includeArrow = false,
}) => {
  const {
    themeStyles, 
    appContainerStyles,
    appFontStyles,
    manualGradientColors,
  } = useGlobalStyle();
 
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
 
  const progress = useSharedValue(0);
  const translateYx2 = useSharedValue(0);
  const startColor = useSharedValue("transparent");
  const endColor = useSharedValue("red");
  const textColor = useSharedValue(themeStyles.genericText.color);

  //  show animation based on if top item in FlatList in parent
  useAnimatedReaction(
    () => {
      return Boolean(
        isUnlocked
      );
    },
    (isVisible, prevIsVisible) => {
      if (isVisible !== prevIsVisible) {
        if (isVisible) {
          startColor.value = manualGradientColors.darkColor; //themeAheadOfLoading.darkColor;
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
          startColor.value = "transparent";
          endColor.value = "transparent";
          textColor.value = themeStyles.genericText.color;
        }
      }
    },
    [isUnlocked]
  );

  const animatedCardsStyle = useAnimatedStyle(() => { 

    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [startColor.value, endColor.value]
    );

    return {
      backgroundColor,
      alignItems: 'center',
      textAlign: 'center',
      alignSelf: 'center',
      color: textColor.value,
      transform: [{ translateY: translateYx2.value }],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[animatedCardsStyle, appContainerStyles.actionUnlockedButton, {alignItems: "center"}]}
      onPress={() => {
        onPress(label);
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          appFontStyles.actionUnlockedButtonText,
          themeStyles.genericText,
          animatedCardsStyle,
        ]}
      >
         {label}{"  "}

      </Animated.Text>
               {includeArrow && (
                        <View
              style={{
                transform: [{ rotate: "180deg" }],
                paddingRight: 20,
                width: 20, 
               // alignItems: "center",
              }}
            >
              <BackArrowLongerStemSvg
                height={20}
                width={20}
                color={"#121212"}
              />
            </View>
         )}
    </AnimatedTouchableOpacity>
  );
};

export default ActionUnlockedButton;
