 

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

// ---- readability tuning ----
const SHADOW_COLOR = "rgba(0,0,0,0.95)";
const SHADOW_DX = 0;
const SHADOW_DY = 3;

// If you want “cannot fail” readability, keep this true.
// If you want a cleaner look, set false and rely on the shadow only.
const USE_OUTLINE = true;
const OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_R = 1; // try 1 or 2

type Props = {
  total: number;
  skiaFont: SkFont;
  textColor: string;
};

const AnimatedClimber = ({ total, skiaFont, textColor , containerStyle}: Props) => {
  const totalValue = useSharedValue(0);

  useEffect(() => {
    if (total == null) return;
    totalValue.value = withTiming(total, { duration: 1000 });
  }, [total, totalValue]);

  const targetText = useDerivedValue(() => `${Math.round(totalValue.value)}`);

  // Center X based on measured text width
  const textX = useDerivedValue(() => {
    const m = skiaFont.measureText(targetText.value);
    return (CANVAS_WIDTH - m.width) / 2;
  });

  // Center Y using font metrics (keeps visual centering even if font size changes)
  const textY = useDerivedValue(() => {
    const metrics = skiaFont.getMetrics();
    // Skia y is the baseline. This computes a baseline that visually centers glyphs.
    return CANVAS_HEIGHT / 2 - (metrics.ascent + metrics.descent) / 2;
  });

  // Precompute shadow/outline positions (avoid creating derived values in JSX)
  const shadowX = useDerivedValue(() => textX.value + SHADOW_DX);
  const shadowY = useDerivedValue(() => textY.value + SHADOW_DY);

  const leftX = useDerivedValue(() => textX.value - OUTLINE_R);
  const rightX = useDerivedValue(() => textX.value + OUTLINE_R);
  const upY = useDerivedValue(() => textY.value - OUTLINE_R);
  const downY = useDerivedValue(() => textY.value + OUTLINE_R);

  if (!skiaFont) return null;

  return (
    <View pointerEvents="none" style={containerStyle}>
      <Canvas pointerEvents="none" style={styles.canvas}>
        <Group>
          {/* Shadow (offset via x/y) */}
          <Text
            x={shadowX}
            y={shadowY}
            text={targetText}
            font={skiaFont}
            color={SHADOW_COLOR}
            opacity={1}
          />

          {/* Optional outline (4-way) */}
          {USE_OUTLINE && (
            <>
              <Text
                x={leftX}
                y={textY}
                text={targetText}
                font={skiaFont}
                color={OUTLINE_COLOR}
                opacity={1}
              />
              <Text
                x={rightX}
                y={textY}
                text={targetText}
                font={skiaFont}
                color={OUTLINE_COLOR}
                opacity={1}
              />
              <Text
                x={textX}
                y={upY}
                text={targetText}
                font={skiaFont}
                color={OUTLINE_COLOR}
                opacity={1}
              />
              <Text
                x={textX}
                y={downY}
                text={targetText}
                font={skiaFont}
                color={OUTLINE_COLOR}
                opacity={1}
              />
            </>
          )}

          {/* Main text */}
          <Text
            x={textX}
            y={textY}
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
  // container: {
  //   position: "absolute",
  //   top: -700,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },
});

export default AnimatedClimber;