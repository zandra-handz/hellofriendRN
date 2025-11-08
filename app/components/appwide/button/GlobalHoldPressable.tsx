import React, { ReactNode, useState } from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  onPress?: () => void;
 
  hitSlop?: number;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const GlobalHoldPressable = ({
  onPress = () => console.log("nothing here"),
 
  hitSlop = 10,
  zIndex = 1,
  style,
  children,
}: Props) => {
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

  const isPressed = useSharedValue(false);

  const HOLD_DURATION = 400;
  const COMPLETE_THRESHOLD = 0.98;

  const pressProgress = useSharedValue(0);
  const pressOpacity = useSharedValue(0);

  const animatedFillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: pressProgress.value }],
    opacity: pressProgress.value,
  })); 

  const handlePressIn = () => {
    isPressed.value = true;
    pressProgress.value = withTiming(
      1,
      { duration: HOLD_DURATION },
      (finished) => {
        if (finished && pressProgress.value >= COMPLETE_THRESHOLD) {
          runOnJS(onPress)();
        }
      }
    );
  };

  const handlePressOut = () => {
    if (pressProgress.value < COMPLETE_THRESHOLD) {
      isPressed.value = false;
      pressProgress.value = withTiming(0, { duration: 300 });
    } else if (pressProgress.value >= COMPLETE_THRESHOLD){
      pressProgress.value = withTiming(0, { duration: 0})
      
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setButtonSize({ width, height });
  };

  return (
    <Pressable
      hitSlop={hitSlop}
      style={[style, { zIndex }]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      //   onPressIn={() => {
      //     scale.value = withSpring(0.65, {
      //       stiffness: 500, // higher = faster response
      //       damping: 30, // higher = less bounce
      //       mass: 0.5, // lower mass = quicker
      //     });
      //   }}
      //   onPressOut={() => {
      //     scale.value = withSpring(1, {
      //       stiffness: 600, // higher = faster response
      //       damping: 30, // higher = less bounce
      //       mass: 0.5, // lower mass = quicker
      //     });

      //     // trigger the light burst
      //     burstScale.value = 0.5;
      //     burstOpacity.value = 0.4;
      //     burstScale.value = withDelay(100, withTiming(2, { duration: 300 }));
      //     burstOpacity.value = withTiming(0, { duration: 300 });
      //   }}
    >
  
      <Animated.View
        onLayout={onLayout}
        style={[
          // style,
          //   animatedStyle,
          animatedFillStyle,
          {
            flex: 1,
            justifyContent: "flex-start",
            borderRadius: 999,
            backgroundColor: manualGradientColors.lightColor,
          },
        ]}
      >
        {children}

 
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default GlobalHoldPressable;
