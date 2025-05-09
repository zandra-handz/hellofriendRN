import React, { useState, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ButtonRoot from "../buttons/scaffolding/ButtonRoot";
import ButtonMenuOption from "../buttons/scaffolding/ButtonMenuOption"; 

const AnimatedSpeedDialTemplate = ({
  rootButtonIcon: RootButtonIcon,
  topOptionIcon: TopOptionIcon,
  topOptionOnPress,
  secondTopOptionIcon: SecondTopOptionIcon,
  secondTopOptionOnPress,
  optionButtonIconSize = 32,
  optionButtonDiameter = 50,
  animatedHeightTopOption = -60,
  animatedHeightSecondTopOption = -38,
}) => {
  const { manualGradientColors } = useGlobalStyle();
  const [expanded, setExpanded] = useState(false);
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current; // New animation value for rotation

  const toggleButtons = () => {
    if (!expanded) {
      setExpanded(true);

      Animated.parallel([
        Animated.timing(animation1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation2, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Collapses option buttons
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 0, // Reset rotation
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(animation2, {
            toValue: 0,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animation1, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => setExpanded(false));
    }
  };

  const buttonTranslateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, animatedHeightSecondTopOption],
  });

  const buttonTranslateY2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, animatedHeightTopOption],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.smallButtonContainer,
          {
            transform: [{ translateY: buttonTranslateY2 }],
            opacity: animation2,
          },
        ]}
      >
        <ButtonMenuOption
          onPress={topOptionOnPress}
          containerWidth={"auto"}
          circleSize={optionButtonDiameter}
          icon={TopOptionIcon}
          iconSize={optionButtonIconSize}
          iconColor={manualGradientColors.lightColor}
          backgroundColor={manualGradientColors.homeDarkColor}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.smallButtonContainer,
          {
            transform: [{ translateY: buttonTranslateY1 }],
            opacity: animation1,
            top: 0,
          },
        ]}
      >
        <ButtonMenuOption
          onPress={secondTopOptionOnPress}
          containerWidth={"auto"}
          circleSize={optionButtonDiameter}
          icon={SecondTopOptionIcon}
          iconSize={optionButtonIconSize}
          iconColor={manualGradientColors.lightColor}
          backgroundColor={manualGradientColors.homeDarkColor}
        />
      </Animated.View>

      <ButtonRoot
        expanded={expanded}
        icon={RootButtonIcon}
        iconSize={42}
        onPress={toggleButtons}
        backgroundColor={manualGradientColors.homeDarkColor}
        iconColor={manualGradientColors.lightColor}
        rotation={rotation} // Pass rotation to the main button
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    flexWrap: "wrap",
    width: 73,
    alignContent: "center",
    justifyContent: "center",
    right: 10,
    bottom: 20,
    zIndex: 3000,
  },
  smallButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
});

export default AnimatedSpeedDialTemplate;
