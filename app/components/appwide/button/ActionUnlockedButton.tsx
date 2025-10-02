import {  Pressable, StyleSheet } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
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
  primaryColor,
  manualGradientColors,
  label,
  onPress,
  pulseDuration = 2000,
}) => {
  const AnimatedPressable =
    Animated.createAnimatedComponent(Pressable);

  const progress = useSharedValue(0);
  const translateYx2 = useSharedValue(0);
  const startColor = useSharedValue("transparent");
  const endColor = useSharedValue("red");
  const textColor = useSharedValue(primaryColor);

  //  show animation based on if top item in FlatList in parent
  useAnimatedReaction(
    () => {
      return Boolean(isUnlocked);
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
          textColor.value = primaryColor;
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
      alignItems: "center", 
      textAlign: "center",
      alignSelf: "center",
      color: textColor.value,
      transform: [{ translateY: translateYx2.value }],
    };
  });

  return (
    <AnimatedPressable
      style={[
        animatedCardsStyle,
        styles.actionUnlockedButton,
        { alignItems: "center" },
      ]}
      onPress={() => {
        onPress(label);
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[styles.buttonText, animatedCardsStyle, { color: primaryColor }]}
      >
        {label}
        {"  "}
      </Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  actionUnlockedButton: {
    // borderBottomWidth: 0.8,
    borderWidth: StyleSheet.hairlineWidth,
    alignText: "right",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 10,
    //marginHorizontal: 6,
    borderRadius: 16,
    height: "auto",
    width: "auto",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 13, 
    height: "100%",
    alignSelf: "center",
  },
});

export default ActionUnlockedButton;
