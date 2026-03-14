import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const BouncyEntranceDown = ({ children, delay = 0, style }) => {
  const translateY = useSharedValue(-60);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withTiming(-60, { duration: 0 });
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20,
        stiffness: 150,
        mass: 0.2,
        overshootClamping: false,
      }),
    );
  }, []);

  return (
    <Animated.View pointerEvents="auto" style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default BouncyEntranceDown;