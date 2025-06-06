import React, { ReactNode } from "react";
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

  const direction = useFriendColors
    ? [0, 0, 1, 0]
    : reverse
    ? [0, 0, 1, 1]
    : [0, 1, 1, 0];

  const beginningColor = useFriendColors
    ? themeAheadOfLoading.darkColor
    : startColor || manualGradientColors.lightColor;
  const endingColor = useFriendColors
    ? themeAheadOfLoading.lightColor
    : endColor || manualGradientColors.darkColor;

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
