import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ViewStyle, StyleProp } from "react-native";

interface BouncyEntranceProps {
  children: React.ReactNode;
  delay?: number;  
  style?: StyleProp<ViewStyle>;  
}


//could NOT use entering prop on reanimated view inside modal and keep the pressables inside of it
// clickable at the same time (at least on Android), so wrapping every button with this instead!
const BouncyEntrance: React.FC<BouncyEntranceProps> = ({ children, delay = 0, style }) => {
  const translateY = useSharedValue(60);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => { 
    translateY.value = withTiming(60, { duration: 0 });
 
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20, // controls the bouncy-aftereffectness
        stiffness: 150,
        mass: 0.2, // lower = faster
        overshootClamping: false,
      })
    );
  }, []);

  return (
    <Animated.View pointerEvents="auto" style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};


export default BouncyEntrance;