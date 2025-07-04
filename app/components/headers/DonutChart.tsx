import { View, StyleSheet } from "react-native";
import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Canvas, Path, SkFont, Skia, Text } from "@shopify/react-native-skia";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  font: SkFont;
  smallFont: SkFont;
  color: string;
  totalValue: SharedValue<number>;
};

const DonutChart = ({
  radius,
  strokeWidth,
  outerStrokeWidth,
  color,
  font,
  smallFont,
  totalValue,
}: Props) => {
  const { themeStyles } = useGlobalStyle();
  const innerRadius = radius - outerStrokeWidth / 2;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(
    () => `${Math.round(totalValue.value)}`,
    []
  );

  const fontSize = font.measureText("$00");
  const smallFontSize = smallFont.measureText("Total Spent");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 2;
  });

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color={"#f4f7fc"}
          style={"stroke"}
          strokeWidth={outerStrokeWidth}
          strokeCap="round"
          strokeJoin="round"
          start={0}
          end={1}
        />
                <Text
          x={radius - smallFontSize.width / 2 }
          y={radius + smallFontSize.height / 2 - fontSize.height / 1.2}
          text={'Total in category'}
          font={smallFont} 
          color={'hotpink'}
       />
        <Text
          x={textX}
          y={radius + fontSize.height / 2}
          text={targetText}
          font={font} 
          color={'hotpink'}
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
