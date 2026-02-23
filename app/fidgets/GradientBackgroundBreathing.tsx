import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import manualGradientColors from "@/app/styles/StaticColors";
 import gradientDirections from "../styles/GradientDirections";
import GradientBackgroundForFidget from "../components/appwide/display/GradientBackgroundForFidget";
type Props = {
  friendColorDark: string;
  friendColorLight: string;
};

const GradientBackgroundBreathing = ({
  firstColorSetDark,
  firstColorSetLight,
  children,
  style,
  speed,
  secondColorSetDark,
  secondColorSetLight,
  direction = "original", //horizontal, vertical, original
  timeScore = 100,
  daysSince,
}: Props) => {
  // const [changeColors, setChangeColors] = useState(false);

  const OGDirectionSet = [
    [0, 0, 1, 0],  
    [0, 1, 1, 0],  
  ];

  const horizontalSet = [
    gradientDirections.topLeftToTopRight,
    gradientDirections.bottomRightToBottomLeft
   
  ];

  const verticalSet = [gradientDirections.topLeftToBottomLeft];

  const directions =
    direction === "vertical"
      ? verticalSet
      : direction === "horizontal"
        ? horizontalSet
        : OGDirectionSet;

  const friendColors = [firstColorSetDark, firstColorSetLight];
  const appColors =
    secondColorSetDark && secondColorSetLight
      ? [secondColorSetDark, secondColorSetLight]
      : [[manualGradientColors.darkColor, manualGradientColors.lightColor]];

  const colors = [...friendColors, ...appColors];

  return (
    <GradientBackgroundForFidget
      additionalStyles={style}
      children={children}
      switchColorSet={false} // was changeColors
      screenname={"fidget"}
      useVibration={!!(timeScore < 41)}
      // additionalStyles={[

      //   style,
      // ]}
      firstSetColorDark={colors[0]}
      firstSetColorLight={colors[1]}
      firstSetDirection={directions[1]} //OGDirectionSet[0]
      speed={speed}
      secondSetColorDark={timeScore > 40 ? colors[2] : "#6B0C0C"}
      secondSetColorLight={timeScore > 40 ? colors[3] : "red"}
      secondSetDirection={directions[1]} //OGDirectionSet[1]
    >
     

    </GradientBackgroundForFidget>
  );
};

export default GradientBackgroundBreathing;
