import React, { ReactNode, useMemo } from "react";
import { ViewStyle, StyleProp } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

interface GradientBackgroundProps {
  useFriendColors?: boolean;
  startColor?: string;
  endColor?: string;
  reverse?: boolean;
  additionalStyles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  useFriendColors = false,
  startColor,
  endColor,
  reverse = false,
  additionalStyles,
  children,
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const { manualGradientColors } = useGlobalStyle();

 
const direction = useMemo(() => {
  if (useFriendColors) return [0, 0, 1, 0];
  if (reverse) return [0, 0, 1, 1];
  return [0, 1, 1, 0];
}, [useFriendColors, reverse]);

const beginningColor = useMemo(() => {
  return useFriendColors
    ? themeAheadOfLoading.darkColor
    : startColor || manualGradientColors.lightColor;
}, [useFriendColors, themeAheadOfLoading.darkColor, startColor, manualGradientColors.lightColor]);

const endingColor = useMemo(() => {
  return useFriendColors
    ? themeAheadOfLoading.lightColor
    : endColor || manualGradientColors.darkColor;
}, [useFriendColors, themeAheadOfLoading.lightColor, endColor, manualGradientColors.darkColor]);

  return (
    <LinearGradient
      colors={[beginningColor, endingColor]}
      start={{ x: direction[0], y: direction[1] }}
      end={{ x: direction[2], y: direction[3] }}
      style={[
        additionalStyles,
        {
          flex: 1,
         // justifyContent: "space-between",
          width: "100%",
        },
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
