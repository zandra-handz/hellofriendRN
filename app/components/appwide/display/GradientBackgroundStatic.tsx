import React, { ReactNode, useState } from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue } from "react-native";

import manualGradientColors from "@/app/styles/StaticColors";

interface GradientBackgroundProps {
  color0: string | null;
  color1: string | null;
  direction: [];
  additionalStyles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const GradientBackgroundStatic: React.FC<GradientBackgroundProps> = ({
  color0,
  color1,
  direction,
  children,
  additionalStyles,
}) => {
  const startColor = color0 ? color0 : manualGradientColors.lightColor;
  const endColor = color1 ? color1 : manualGradientColors.darkColor;

  const initialColors: [ColorValue, ColorValue] = [startColor, endColor];

  const [previousColors, setPreviousColors] = useState(initialColors);

  return (
    <LinearGradient
      colors={previousColors}
      start={{ x: direction[0], y: direction[1] }}
      end={{ x: direction[2], y: direction[3] }}
      style={[StyleSheet.absoluteFill, additionalStyles]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default React.memo(GradientBackgroundStatic);
