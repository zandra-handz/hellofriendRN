import React, { useEffect, useRef  } from "react";
import { Animated, StyleSheet } from "react-native"; 

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
        styles.container,
        styles.spacingStyle,
        {
          width: width,
          backgroundColor: returnAnimation ? animatedCircleColor : staticColor, 
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.flashAnimText,
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignContents: "center",
    justifyContent: "center",
    textAlign: "center",

    height: "auto",
    minHeight: 130,
  },
  spacingStyle: {
    borderRadius: 40,
    padding: 20,
  },
    flashAnimText: {
    fontFamily: "Poppins-Bold",
    alignSelf: "center",
  },

});

export default FlashAnimNonCircle;
