// import React from "react";
// import { StyleSheet, View } from "react-native";
// import {
//   Canvas,
//   Text,
//   Group,
// } from "@shopify/react-native-skia";
// import {
//   useSharedValue,
//   useAnimatedReaction,
//   withSequence,
//   withTiming,
//   withDelay,
//   useDerivedValue,
// } from "react-native-reanimated";
// import { SharedValue } from "react-native-reanimated";
// import type { SkFont } from "@shopify/react-native-skia";

// const CANVAS_WIDTH = 200;
// const CANVAS_HEIGHT = 100;
// const CENTER_X = CANVAS_WIDTH / 2;
// const CENTER_Y = CANVAS_HEIGHT / 2;

// type Props = {
//   countValue: SharedValue<number>;
//   addColor: string;
//   subtractColor: string;
//   glowCenterColor: string;
//   glowEdgeColor: string;
//   fontLarge: SkFont;
//   fontSmall: SkFont;
// };

// const AnimatedCounter = ({
//   countValue,
//   addColor,
//   subtractColor,
//   glowCenterColor,
//   glowEdgeColor,
//   fontLarge,
//   fontSmall,
// }: Props) => {
//   const baseOpacity = useSharedValue(0);
//   const overlayOpacity = useSharedValue(0);
//   const overlayY = useSharedValue(0);
//   const scale = useSharedValue(1);
//   const displayCount = useSharedValue(0);
//   const displayDelta = useSharedValue(0);
//   const isPositive = useSharedValue(true);

//   useAnimatedReaction(
//     () => countValue.value,
//     (current, previous) => {
//       "worklet";

//       if (previous === null || previous === undefined) return;
//       if (current === previous) return;

//       const delta = current - previous;
//       const absDelta = Math.abs(delta);
//       const isBig = absDelta >= 10;
//       const isTiny = absDelta < 3;

//       displayCount.value = current;
//       displayDelta.value = delta;
//       isPositive.value = delta >= 0;

//       baseOpacity.value = withSequence(
//         withTiming(1, { duration: 100 }),
//         withDelay(500, withTiming(0, { duration: 800 }))
//       );

//       overlayOpacity.value = withSequence(
//         withTiming(1, { duration: 50 }),
//         withTiming(0, { duration: isBig ? 800 : 500 })
//       );

//       overlayY.value = 0;
//       overlayY.value = withTiming(isBig ? -60 : -35, {
//         duration: isBig ? 800 : 500,
//       });

//       if (!isTiny) {
//         scale.value = withSequence(
//           withTiming(isBig ? 2.2 : 1.4, { duration: isBig ? 200 : 150 }),
//           withTiming(1, { duration: isBig ? 500 : 300 })
//         );
//       }
//     }
//   );

//   const countText = useDerivedValue(() => `${Math.round(displayCount.value)}`);
//   const deltaText = useDerivedValue(() => {
//     const d = Math.round(displayDelta.value);
//     return d > 0 ? `+${d}` : `${d}`;
//   });

//   // Calculate centered X position for base text
//   const baseX = useDerivedValue(() => {
//     if (!fontLarge) return CENTER_X;
//     const textWidth = fontLarge.measureText(countText.value).width;
//     return CENTER_X - textWidth / 2;
//   });

//   // Calculate centered X position for overlay text
//   const overlayX = useDerivedValue(() => {
//     if (!fontSmall) return CENTER_X;
//     const textWidth = fontSmall.measureText(deltaText.value).width;
//     return CENTER_X - textWidth / 2;
//   });

//   const baseColor = useDerivedValue(() => glowCenterColor);
//   const overlayColor = useDerivedValue(() =>
//     isPositive.value ? addColor : subtractColor
//   );

//   // Scale transform with origin at center
//   const baseTransform = useDerivedValue(() => [
//     { translateX: CENTER_X },
//     { translateY: CENTER_Y },
//     { scale: scale.value },
//     { translateX: -CENTER_X },
//     { translateY: -CENTER_Y },
//   ]);

//   const overlayTransform = useDerivedValue(() => [
//     { translateX: CENTER_X },
//     { translateY: CENTER_Y },
//     { translateY: overlayY.value },
//     { scale: scale.value },
//     { translateX: -CENTER_X },
//     { translateY: -CENTER_Y },
//   ]);

//   if (!fontLarge || !fontSmall) return null;

//   return (
//     <View style={styles.container}>
//       <Canvas style={styles.canvas}>
//         <Group transform={baseTransform}>
//           <Text
//             x={baseX}
//             y={CENTER_Y + 8}
//             text={countText}
//             font={fontLarge}
//             color={baseColor}
//             opacity={baseOpacity}
//           />
//         </Group>
//         <Group transform={overlayTransform}>
//           <Text
//             x={overlayX}
//             y={CENTER_Y + 6}
//             text={deltaText}
//             font={fontSmall}
//             color={overlayColor}
//             opacity={overlayOpacity}
//           />
//         </Group>
//       </Canvas>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: CANVAS_WIDTH,
//     height: CANVAS_HEIGHT,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   canvas: {
//     width: CANVAS_WIDTH,
//     height: CANVAS_HEIGHT,
//   },
// });

// export default AnimatedCounter;



import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Canvas,
  Text,
  Group,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useAnimatedReaction,
  withSequence,
  withTiming,
  withDelay,
  useDerivedValue,
} from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";
import type { SkFont } from "@shopify/react-native-skia";

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 100;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;

type Props = {
  countValue: SharedValue<number>;
  addColor: string;
  subtractColor: string;
  glowCenterColor: string;
  glowEdgeColor: string;
  fontLarge: SkFont;
  fontSmall: SkFont;
};

const AnimatedCounter = ({
  countValue,
  addColor,
  subtractColor,
  glowCenterColor,
  glowEdgeColor,
  fontLarge,
  fontSmall,
}: Props) => {
  const baseOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(1);
  const overlayY = useSharedValue(0);
  const baseScale = useSharedValue(1);
  const displayCount = useSharedValue(0);
  const displayDelta = useSharedValue(0);
  const isPositive = useSharedValue(true);

  useAnimatedReaction(
    () => countValue.value,
    (current, previous) => {
      "worklet";

      if (previous === null || previous === undefined) return;
      if (current === previous) return;

      const delta = current - previous;
      const absDelta = Math.abs(delta);
      const isBig = absDelta >= 10;
      const isTiny = absDelta < 3;

      displayCount.value = current;
      displayDelta.value = delta;
      isPositive.value = delta >= 0;

      // Background number: subtle fade, peaks at 0.3 opacity
      baseOpacity.value = withSequence(
        withTiming(0.65, { duration: 100 }),
        withDelay(600, withTiming(0, { duration: 1000 }))
      );

      // Background scale: gentle pulse
      baseScale.value = withSequence(
        withTiming(isBig ? 1.3 : 1.15, { duration: isBig ? 200 : 150 }),
        withTiming(1, { duration: isBig ? 500 : 300 })
      );

      // Delta overlay: bright and bold, peaks at full opacity
      overlayOpacity.value = withSequence(
        withTiming(1, { duration: 50 }),
        withDelay(200, withTiming(0, { duration: isBig ? 1000 : 700 }))
      );

      // Delta scale: pop effect
      overlayScale.value = withSequence(
        withTiming(isBig ? 2.4 : 2., { duration: isBig ? 150 : 100 }), //1.8, 1.4
        withTiming(1, { duration: isBig ? 400 : 300 })
      );

      // Delta Y movement
      overlayY.value = 0;
      overlayY.value = withTiming(isBig ? -50 : -30, {
        duration: isBig ? 1000 : 700,
      });
    }
  );

  const countText = useDerivedValue(() => `${Math.round(displayCount.value)}`);
  const deltaText = useDerivedValue(() => {
    const d = Math.round(displayDelta.value);
    return d > 0 ? `+${d}` : `${d}`;
  });

  // Calculate centered X position for base text
  const baseX = useDerivedValue(() => {
    if (!fontLarge) return CENTER_X;
    const textWidth = fontLarge.measureText(countText.value).width;
    return CENTER_X - textWidth / 2;
  });

  // Calculate centered X position for overlay text
  const overlayX = useDerivedValue(() => {
    if (!fontSmall) return CENTER_X;
    const textWidth = fontSmall.measureText(deltaText.value).width;
    return CENTER_X - textWidth / 2;
  });

  const baseColor = useDerivedValue(() => glowCenterColor);
  const overlayColor = useDerivedValue(() =>
    isPositive.value ? addColor : subtractColor
  );

  // Background: subtle scale from center
  const baseTransform = useDerivedValue(() => [
    { translateX: CENTER_X },
    { translateY: CENTER_Y },
    { scale: baseScale.value },
    { translateX: -CENTER_X },
    { translateY: -CENTER_Y },
  ]);

  // Overlay: scale + float up
  const overlayTransform = useDerivedValue(() => [
    { translateX: CENTER_X },
    { translateY: CENTER_Y },
    { translateY: overlayY.value },
    { scale: overlayScale.value },
    { translateX: -CENTER_X },
    { translateY: -CENTER_Y },
  ]);

  if (!fontLarge || !fontSmall) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      <Canvas pointerEvents="none" style={styles.canvas}>
        {/* Background total - subtle */}
        <Group transform={baseTransform}>
          <Text
            x={baseX}
            y={CENTER_Y + 8}
            text={countText}
            font={fontLarge}
            color={baseColor}
            opacity={baseOpacity}
          />
        </Group>
        {/* Delta overlay - prominent */}
        <Group transform={overlayTransform}>
          <Text
            x={overlayX}
            y={CENTER_Y + 6}
            text={deltaText}
            font={fontSmall}
            color={overlayColor}
            opacity={overlayOpacity}
          />
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },
});

export default AnimatedCounter;