import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type HintArrowProps = {
  // Position in screen coordinates (0-1)
  x: number;
  y: number;
  // Angle in radians (direction the arrow should point)
  angle?: number;
  // Show/hide the hint
  visible: boolean;
  // Canvas dimensions
  width: number;
  height: number;
  // Color
  color?: string;
};

const HintArrow = ({
  x,
  y,
  angle = 0,
  visible,
  width,
  height,
  color = '#4A90E2',
}: HintArrowProps) => {
  const pulseScale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Fade in
      opacity.value = withTiming(1, { duration: 300 });
      
      // Start pulsing animation
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite
        false
      );
    } else {
      // Fade out
      opacity.value = withTiming(0, { duration: 200 });
      pulseScale.value = 1;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: x * width,
      top: y * height,
      opacity: opacity.value,
      transform: [
        { translateX: -25 }, // Center the 50px SVG
        { translateY: -25 },
        { scale: pulseScale.value },
        { rotate: `${angle}rad` },
      ],
    };
  });

  return (
    <AnimatedSvg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      style={animatedStyle}
    >
      {/* Outer glow circle */}
      <Circle
        cx="25"
        cy="25"
        r="20"
        fill={color}
        opacity="0.2"
      />
      
      {/* Inner circle */}
      <Circle
        cx="25"
        cy="25"
        r="12"
        fill={color}
        opacity="0.5"
      />
      
      {/* Center dot */}
      <Circle
        cx="25"
        cy="25"
        r="6"
        fill={color}
      />
      
      {/* Optional: Add a small arrow pointing down */}
      <Path
        d="M 25 35 L 20 30 L 30 30 Z"
        fill={color}
      />
    </AnimatedSvg>
  );
};

export default HintArrow;