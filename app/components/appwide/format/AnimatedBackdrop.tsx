import { StyleSheet } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  color: string;
  zIndex: number;
  isVisibleValue: SharedValue<boolean>;
};

const AnimatedBackdrop = ({ color, zIndex = 5, isVisibleValue }: Props) => {
  const opacity = useDerivedValue(() =>
    withTiming(isVisibleValue.value ? 1 : 0, { duration: 400 })
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: opacity.value > 0.5 ? "auto" : "none",
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        backdropStyle,
        { backgroundColor: color, zIndex: zIndex },
      ]}
    />
  );
};

export default AnimatedBackdrop;