import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import manualGradientColors from "@/app/styles/StaticColors";
 
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
    [0, 0, 1, 0], // startX, startY, endX, endY //00 TOP LEFT  // 11 BOTTOM RIGHT
    //start: X, Y
    //end:   X, Y

    // HORIZONTAL LEFT TO RIGHT
    [0, 1, 1, 0], //DIAGONAL TOP RIGHT TO BOTTOM LEFT
  ];

  const horizontalSet = [
    //creates almost a revolving feeling
    [0, 0, 1, 0],
    [1, 1, 0, 1],
  ];

  const verticalSet = [[0, 0, 0, 1]];

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
