import { useState, useEffect } from "react";
import {   Pressable, Animated, StyleSheet, Easing } from "react-native";
 import manualGradientColors from "@/app/styles/StaticColors";
import { useLDTheme } from "@/src/context/LDThemeContext";


type Props = {
  value: boolean;
  onToggle: () => void;
}

const ToggleButton = ({ value, onToggle }: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const [bounceAnim] = useState(new Animated.Value(value ? 20 : 0));
 

  useEffect(() => {
    const newValue = value ? 20 : 0;
    Animated.timing(bounceAnim, {
      toValue: newValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const animatedStyle = {
    transform: [
      {
        translateX: bounceAnim,
      },
    ],
  };

  const accessibilityLabel = value ? "Enabled" : "Disabled";
  const accessibilityState = { selected: value };

  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Toggle button. ${accessibilityLabel}`}
      accessibilityState={accessibilityState}
      style={[
        styles.container,
        value ? styles.on : styles.off,
        {
          backgroundColor: value
            ? manualGradientColors.lightColor
            : lightDarkTheme.primaryText,
        },
      ]}
      onPress={() => {
        onToggle();
      }}
    >
      <Animated.View
        style={[
          styles.circle,
          animatedStyle,
          { backgroundColor: lightDarkTheme.primaryBackground },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: "auto",
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: ".5%",
    paddingVertical: ".5%",
  },
  on: {
    backgroundColor: "#4cd137",
  },
  off: {
    backgroundColor: "#dcdde1",
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
  },
});

export default ToggleButton;
