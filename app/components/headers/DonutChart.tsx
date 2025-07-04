import { View, StyleSheet } from "react-native";
import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Canvas, Path, SkFont, Skia, Text } from "@shopify/react-native-skia";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import DonutPath from "./DonutPath";

type Props = {
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  font: SkFont;
  smallFont: SkFont;
  color: string;
  backgroundColor: string;
  totalValue: SharedValue<number>;
  n: number;
  gap: number;
  decimalsValue: SharedValue<number[]>;
  colors: string[];
};

const DonutChart = ({
  radius,
  strokeWidth,
  outerStrokeWidth,
  color,
  backgroundColor,
  font,
  smallFont,
  totalValue,
  n,
  gap,
  decimalsValue,
  colors,
}: Props) => {
  const array = Array.from({ length: n }); 
  const innerRadius = radius - outerStrokeWidth / 2;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(
    () => `${Math.round(totalValue.value)}`,
    []
  );

 
  const fontSize = font.measureText("$0");
  const smallFontSize = smallFont.measureText("Total");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 1.8;
  });

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color={backgroundColor}

          style={"stroke"}
          strokeWidth={outerStrokeWidth}
          strokeCap="round"
          strokeJoin="round"
          start={0}
          end={1}
        />
        {array.map((_, index) => {
          return <DonutPath key={index}
          radius={radius}
          strokeWidth={strokeWidth}
          outerStrokeWidth={outerStrokeWidth}
          color={colors[index]}
          decimalsValue={decimalsValue}
          index={index}
          gap={gap}
          
          
          />;
        })}
        {/* <Text
          x={radius - smallFontSize.width / 3}
          y={radius + smallFontSize.height / 3 - fontSize.height / 2.2}
          text={"Total"}
     
          font={smallFont}
          color={color}
        /> */}
        <Text
          x={textX}
          y={radius + fontSize.height / 2.4}
          text={targetText}
          font={font}
          color={color}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
 
    flex: 1,
  },
});

export default DonutChart;
