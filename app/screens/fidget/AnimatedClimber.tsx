import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Canvas, Text, Group } from "@shopify/react-native-skia";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import type { SkFont } from "@shopify/react-native-skia";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 100;

type Props = {
  total: number;
  skiaFont: SkFont;
};

const AnimatedClimber = ({ total, skiaFont, textColor }: Props) => {
  const totalValue = useSharedValue(0);

  useEffect(() => {
    if (!total) return;
    totalValue.value = withTiming(total, { duration: 1000 });
  }, [total]);

  const targetText = useDerivedValue(
    () => `${Math.round(totalValue.value)}`,
    [],
  );

  const textX = useDerivedValue(() => {
    const _fontSize = skiaFont.measureText(targetText.value);
    return (CANVAS_WIDTH - _fontSize.width) / 2;
  });

  if (!skiaFont) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      <Canvas pointerEvents="none" style={styles.canvas}>
        <Group>
          <Text
            x={textX}
            y={50}
            text={targetText}
            font={skiaFont}
            color={textColor}
            opacity={1}
          />
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -700,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },
});

export default AnimatedClimber;