// animated total
// import { StyleSheet, TextInput } from "react-native";
// import React, { useEffect } from "react";
// import Animated, {
//   useSharedValue,
//   useAnimatedProps,
//   useAnimatedStyle,
//   useAnimatedReaction,
//   withSequence,
//   withTiming,
//   interpolateColor,
// } from "react-native-reanimated";
// import { SharedValue } from "react-native-reanimated";

// Animated.addWhitelistedNativeProps({ text: true });
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// type Props = {
//   countValue: SharedValue<number>;
//   pause: boolean;
//   triggerReset: boolean;
// };

// const AnimatedCounter = ({ countValue, pause, triggerReset }: Props) => {
//   const scale = useSharedValue(1);
//   const colorProgress = useSharedValue(0);

//   useEffect(() => {
//   scale.value = withTiming(1, { duration: 150 });
//   colorProgress.value = withTiming(0, { duration: 150 });
// }, [triggerReset]);

//   const triggerAnimation = () => {
//     "worklet";
//     scale.value = withSequence(
//       withTiming(1.4, { duration: 150 }),
//       withTiming(1, { duration: 300 })
//     );
//     colorProgress.value = withSequence(
//       withTiming(1, { duration: 100 }),
//       withTiming(0, { duration: 400 })
//     );
//   };

// useAnimatedReaction(
//   () => countValue.value,
//   (current, previous) => {
//     if (current !== previous && previous !== null) {
//       const delta = Math.abs(current - (previous ?? current));
//       const isBig = delta >= 10;
//       const isTiny = delta < 3;

//       if (!isTiny) {
//         scale.value = withSequence(
//           withTiming(isBig ? 2.2 : 1.4, { duration: isBig ? 200 : 150 }),
//           withTiming(1, { duration: isBig ? 500 : 300 })
//         );
//       }

//       colorProgress.value = withSequence(
//         withTiming(1, { duration: isBig ? 50 : 100 }),
//         withTiming(0, { duration: isBig ? 600 : 400 })
//       );
//     }
//   }
// );
//   const animatedCount = useAnimatedProps(() => ({
//     text: `${countValue.value}`,
//     defaultValue: `${countValue.value}`,
//   }));

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//     color: interpolateColor(colorProgress.value, [0, 1], ["white", "yellow"]),
//   }));

//   return (
//     <Animated.View style={styles.container}>
//       <AnimatedTextInput
//         style={animatedStyle}
//         animatedProps={animatedCount}
//         editable={false}
//         defaultValue={""}
//       />
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: "100%",
//     height: 60,
//     padding: 10,
//     borderRadius: 30,
//     backgroundColor: "teal",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default AnimatedCounter;

//animated increment
// import { StyleSheet, TextInput } from "react-native";
// import React, { useEffect } from "react";
// import Animated, {
//   useSharedValue,
//   useAnimatedProps,
//   useAnimatedStyle,
//   useAnimatedReaction,
//   withSequence,
//   withTiming,
//   interpolateColor,
// } from "react-native-reanimated";
// import { SharedValue } from "react-native-reanimated";

// Animated.addWhitelistedNativeProps({ text: true });
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// type Props = {
//   countValue: SharedValue<number>;
//   pause: boolean;
//   triggerReset: boolean;
// };

// const AnimatedCounter = ({ countValue, pause, triggerReset }: Props) => {
//   const scale = useSharedValue(1);
//   const colorProgress = useSharedValue(0);
//   const overlayOpacity = useSharedValue(0);
//   const overlayTranslateY = useSharedValue(0);
//   const deltaValue = useSharedValue(0);

//   useEffect(() => {
//     scale.value = withTiming(1, { duration: 150 });
//     colorProgress.value = withTiming(0, { duration: 150 });
//   }, [triggerReset]);

//   useAnimatedReaction(
//     () => countValue.value,
//     (current, previous) => {
//       if (current !== previous && previous !== null) {
//         const delta = current - (previous ?? current);
//         const absDelta = Math.abs(delta);
//         const isBig = absDelta >= 10;
//         const isTiny = absDelta < 3;

//         // Update delta display value
//         deltaValue.value = delta;

//         // Overlay: pop up and fade out
//         overlayOpacity.value = 1;
//         overlayTranslateY.value = 0;
//         overlayOpacity.value = withSequence(
//           withTiming(1, { duration: 50 }),
//           withTiming(0, { duration: isBig ? 800 : 500 })
//         );
//         overlayTranslateY.value = withTiming(isBig ? -60 : -35, {
//           duration: isBig ? 800 : 500,
//         });

//         // Base text scale
//         if (!isTiny) {
//           scale.value = withSequence(
//             withTiming(isBig ? 2.2 : 1.4, { duration: isBig ? 200 : 150 }),
//             withTiming(1, { duration: isBig ? 500 : 300 })
//           );
//         }

//         colorProgress.value = withSequence(
//           withTiming(1, { duration: isBig ? 50 : 100 }),
//           withTiming(0, { duration: isBig ? 600 : 400 })
//         );
//       }
//     }
//   );

//   // Base count (static text, no animation)
//   const baseCountProps = useAnimatedProps(() => ({
//     text: `${countValue.value}`,
//     defaultValue: `${countValue.value}`,
//   }));

//   // Overlay delta (animated)
//   const overlayCountProps = useAnimatedProps(() => ({
//     text: deltaValue.value > 0 ? `+${deltaValue.value}` : `${deltaValue.value}`,
//     defaultValue: "",
//   }));

//   const baseStyle = useAnimatedStyle(() => ({
//     color: interpolateColor(colorProgress.value, [0, 1], ["white", "yellow"]),
//     transform: [{ scale: scale.value }],
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//   }));

//   const overlayStyle = useAnimatedStyle(() => ({
//     position: "absolute",
//     opacity: overlayOpacity.value,
//     transform: [
//       { translateY: overlayTranslateY.value },
//       { scale: scale.value },
//     ],
//     color: deltaValue.value >= 0 ? "lime" : "red",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   }));

//   return (
//     <Animated.View style={styles.container}>
//       <AnimatedTextInput
//         style={baseStyle}
//         animatedProps={baseCountProps}
//         editable={false}
//         defaultValue={""}
//       />
//       <AnimatedTextInput
//         style={overlayStyle}
//         animatedProps={overlayCountProps}
//         editable={false}
//         defaultValue={""}
//         pointerEvents="none"
//       />
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: "100%",
//     height: 0,
//     padding: 10,
//     borderRadius: 30,
//     backgroundColor: "teal",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default AnimatedCounter;

import { StyleSheet, TextInput } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useAnimatedReaction,
  withSequence,
  withTiming,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  countValue: SharedValue<number>;
  pause?: boolean;
  triggerReset?: boolean;
  addColor: string;
  subtractColor: string;
  glowCenterColor: string;
  glowEdgeColor: string;
  glowColor: string;
};

const AnimatedCounter = ({
  countValue,
  pause,
  triggerReset,
  addColor,
  subtractColor,
  glowCenterColor,
  glowEdgeColor,
}: Props) => {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  const baseOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const overlayTranslateY = useSharedValue(0);
  const deltaValue = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 150 });
    colorProgress.value = withTiming(0, { duration: 150 });
    baseOpacity.value = withTiming(0, { duration: 150 });
  }, [triggerReset]);

  useAnimatedReaction(
    () => countValue.value,
    (current, previous) => {
      if (previous === null || previous === undefined) return;
      if (current === previous) return;

      const delta = current - previous;
      const absDelta = Math.abs(delta);
      const isBig = absDelta >= 10;
      const isTiny = absDelta < 3;

      deltaValue.value = delta;

      // Base count: fade in immediately, fade out after delay
      baseOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(500, withTiming(0, { duration: 800 })),
      );

      // Overlay delta: pop up and fade out
      overlayOpacity.value = 1;
      overlayTranslateY.value = 0;
      overlayOpacity.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: isBig ? 800 : 500 }),
      );
      overlayTranslateY.value = withTiming(isBig ? -60 : -35, {
        duration: isBig ? 800 : 500,
      });

      if (!isTiny) {
        scale.value = withSequence(
          withTiming(isBig ? 2.2 : 1.4, { duration: isBig ? 200 : 150 }),
          withTiming(1, { duration: isBig ? 500 : 300 }),
        );
      }

      colorProgress.value = withSequence(
        withTiming(1, { duration: isBig ? 50 : 100 }),
        withTiming(0, { duration: isBig ? 600 : 400 }),
      );
    },
  );

  const baseCountProps = useAnimatedProps(() => ({
    text: `${countValue.value}`,
    defaultValue: `${countValue.value}`,
  }));

  const overlayCountProps = useAnimatedProps(() => ({
    text: deltaValue.value > 0 ? `+${deltaValue.value}` : `${deltaValue.value}`,
    defaultValue: "",
  }));

  const baseStyle = useAnimatedStyle(() => ({
    color: interpolateColor(colorProgress.value, [0, 1], [glowCenterColor, glowEdgeColor]),
    transform: [{ scale: scale.value }],
    opacity: baseOpacity.value,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    position: "absolute",
    opacity: overlayOpacity.value,
    transform: [
      { translateY: overlayTranslateY.value },
      { scale: scale.value },
    ],
    color: deltaValue.value >= 0 ? addColor : subtractColor,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  }));

  useEffect(() => {
    return () => {
      // Cancel in-flight animations and reset all shared values
      scale.value = 1;
      colorProgress.value = 0;
      baseOpacity.value = 0;
      overlayOpacity.value = 0;
      overlayTranslateY.value = 0;
      deltaValue.value = 0;
    };
  }, []);

  return (
    <Animated.View style={styles.container}>
      <AnimatedTextInput
        style={baseStyle}
        animatedProps={baseCountProps}
        editable={false}
        defaultValue={""}
      />
      <AnimatedTextInput
        style={overlayStyle}
        animatedProps={overlayCountProps}
        editable={false}
        defaultValue={""}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 100,
    height: 80,
    padding: 10,
    borderRadius: 30,
    //  backgroundColor: "teal",
    alignItems: "center",
    justifyContent: "center",

    left: 0,
    right: 0,
  },
});

export default AnimatedCounter;
