
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";

const GradientBackground = ({
  useFriendColors = false,
  startColor,
  endColor,
  reverse = false,
  additionalStyles,
  children,
}) => { 
  const { themeAheadOfLoading } = useFriendList();

  const direction = useFriendColors ? [0,0,1,0] : 
                                    reverse ? [0, 0, 1, 1] : 
                                              [0, 1, 1, 0];

  const beginningColor = useFriendColors
    ? themeAheadOfLoading.darkColor
    : startColor;
  const endingColor = useFriendColors
    ? themeAheadOfLoading.lightColor
    : endColor;

  return (
    <LinearGradient
      colors={[beginningColor, endingColor]}
      start={{ x: direction[0], y: direction[1] }}
      end={{ x: direction[2], y: direction[3] }}
   
      style={[
        additionalStyles && additionalStyles,
        { 
          flex: 1,
          justifyContent: "space-between",
          width: "100%",
        },
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
