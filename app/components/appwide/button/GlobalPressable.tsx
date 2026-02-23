import React, { ReactNode, useCallback } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  onPress?: () => void;
  onLongPress?: () => void;
  hitSlop?: number;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  disableBurst?: boolean; // skip burst effect when not needed
};

const GlobalPressable = ({
  onPress,
  onLongPress,
  hitSlop = 10,
  zIndex = 1,
  style,
  children,
  disableBurst = true, // default OFF for perf
}: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.65, {
      stiffness: 500,
      damping: 30,
      mass: 0.5,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      stiffness: 600,
      damping: 30,
      mass: 0.5,
    });
  }, []);

  return (
    <Pressable
      hitSlop={hitSlop}
      style={[style, { zIndex }]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[animatedStyle, styles.innerContainer]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(GlobalPressable);

// import React, { ReactNode, useCallback, useState } from "react";
// import {
//   Pressable,
//   StyleProp,
//   StyleSheet,
//   ViewStyle,
//   LayoutChangeEvent,
// } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   withDelay,
// } from "react-native-reanimated";

// import manualGradientColors from "@/app/styles/StaticColors";

// type Props = {
//   onPress?: () => void;
//   onLongPress?: () => void;
//   hitSlop?: number;
//   zIndex?: number;
//   style?: StyleProp<ViewStyle>;
//   children?: ReactNode;
// };

// const GlobalPressableWithBurst = ({
//   onPress,
//   onLongPress,
//   hitSlop = 10,
//   zIndex = 1,
//   style,
//   children,
// }: Props) => {
//   const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

//   const scale = useSharedValue(1);
//   const burstScale = useSharedValue(0);
//   const burstOpacity = useSharedValue(0);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   const burstStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: burstScale.value }],
//     opacity: burstOpacity.value,
//   }));

//   const onLayout = useCallback((e: LayoutChangeEvent) => {
//     const { width, height } = e.nativeEvent.layout;
//     setButtonSize((prev) =>
//       prev.width === width && prev.height === height ? prev : { width, height }
//     );
//   }, []);

//   const handlePressIn = useCallback(() => {
//     scale.value = withSpring(0.65, {
//       stiffness: 500,
//       damping: 30,
//       mass: 0.5,
//     });
//   }, []);

//   const handlePressOut = useCallback(() => {
//     scale.value = withSpring(1, {
//       stiffness: 600,
//       damping: 30,
//       mass: 0.5,
//     });

//     burstScale.value = 0.5;
//     burstOpacity.value = 0.4;
//     burstScale.value = withDelay(100, withTiming(2, { duration: 300 }));
//     burstOpacity.value = withTiming(0, { duration: 300 });
//   }, []);

//   return (
//     <Pressable
//       hitSlop={hitSlop}
//       style={[style, { zIndex }]}
//       onPress={onPress}
//       onLongPress={onLongPress}
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//     >
//       <Animated.View
//         onLayout={onLayout}
//         style={[animatedStyle, styles.innerContainer]}
//       >
//         {children}

//         {buttonSize.width > 0 && buttonSize.height > 0 && (
//           <Animated.View
//             pointerEvents="none"
//             style={[
//               {
//                 position: "absolute",
//                 width: buttonSize.width,
//                 height: buttonSize.height,
//                 borderRadius: Math.max(buttonSize.width, buttonSize.height) / 2,
//                 backgroundColor: manualGradientColors.lightColor,
//               },
//               burstStyle,
//             ]}
//           />
//         )}
//       </Animated.View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   innerContainer: {
//     flex: 1,
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default React.memo(GlobalPressableWithBurst);