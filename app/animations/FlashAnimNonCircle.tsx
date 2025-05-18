import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

// this one will auto height to what is inside it
// width is 100%
const FlashAnimNonCircle = ({
  children,
  circleTextSize = 11,
  circleColor = "red",
  countColor = "white",
  flashToColor = "yellow",
  textFlashToColor = "black",
  staticColor = "limegreen",
  minHeight,
  width = "94%",
  returnAnimation,
}) => {
  const { appAnimationStyles, appSpacingStyles } = useGlobalStyle();
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateFlash = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    if (returnAnimation) {
      console.log("RENDERING FLASH COMPONENT");
      animateFlash();
    }
  }, [returnAnimation, flashAnim]);

  const animatedCircleColor = flashAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [circleColor, flashToColor],
  });

  const animatedCountColor = flashAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [countColor, textFlashToColor],
  });

  return (
    <Animated.View
      style={[
        appAnimationStyles.flashAnimMomentsContainer,
        appSpacingStyles.momentsScreenPrimarySpacing,
        {
          width: width,
          backgroundColor: returnAnimation ? animatedCircleColor : staticColor, 
        },
      ]}
    >
      <Animated.Text
        style={[
          appAnimationStyles.flashAnimText,
          {
            color: returnAnimation ? animatedCountColor : staticColor,
            fontSize: circleTextSize,
          },
        ]}
      >
        {children}
      </Animated.Text>
    </Animated.View>
  );
};

export default FlashAnimNonCircle;
