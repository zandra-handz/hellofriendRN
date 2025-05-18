import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const BobbingAnim = ({
  children,
  showAnimation = true,
  bobbingDistance = 5,
  duration = 1000,
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (showAnimation) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-bobbingDistance, { duration }),
          withTiming(0, { duration })
        ),
        -1, 
        false  
      );
    } else {
      translateY.value = withTiming(0, { duration: 200 });  
    }
  }, [showAnimation, bobbingDistance, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, showAnimation && animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Optional styling if needed
  },
});

export default BobbingAnim;
