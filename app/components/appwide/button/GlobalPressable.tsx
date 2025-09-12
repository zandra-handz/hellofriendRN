import React, { ReactNode, useState } from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { manualGradientColors } from "@/src/hooks/StaticColors";

type Props = {
  onPress?: () => void;
  onLongPress?: () => void;
  hitSlop?: number;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const GlobalPressable = ({
  onPress,
  onLongPress,
  hitSlop = 10,
  zIndex = 1,
  style,
  children,
}: Props) => {
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

  const scale = useSharedValue(1);
  const burstScale = useSharedValue(0);
  const burstOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const burstStyle = useAnimatedStyle(() => ({
    transform: [{ scale: burstScale.value }],
    opacity: burstOpacity.value,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setButtonSize({ width, height });
  };

  return (
    <Pressable
      hitSlop={hitSlop}
      style={[style, { zIndex }]}
      onPress={onPress ?? null}
      onLongPress={onLongPress ?? null}
      onPressIn={() => {
        scale.value = withSpring(0.65, {
          stiffness: 500, // higher = faster response
          damping: 30, // higher = less bounce
          mass: .5, // lower mass = quicker
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, {
          stiffness: 600, // higher = faster response
          damping: 30, // higher = less bounce
          mass: .5, // lower mass = quicker


        });

        // trigger the light burst
        burstScale.value = 0.5;
        burstOpacity.value = 0.4;
        burstScale.value = withDelay(100, withTiming(2, { duration: 300 }));
        burstOpacity.value = withTiming(0, { duration: 300 });
      }}
    >
      <Animated.View
        onLayout={onLayout}
        style={[
          style,
          animatedStyle,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {children}

        {buttonSize.width > 0 && buttonSize.height > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                width: buttonSize.width,
                height: buttonSize.height,
                borderRadius: Math.max(buttonSize.width, buttonSize.height) / 2,
                // backgroundColor: "rgba(255,255,255,0.5)",
                backgroundColor: manualGradientColors.lightColor,
              },
              burstStyle,
            ]}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

export default GlobalPressable;
