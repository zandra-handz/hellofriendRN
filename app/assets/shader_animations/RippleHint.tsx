import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RippleHintProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};

const RippleHint = ({
  x,
  y,
  width,
  height,
  color = '#4A90E2',
}: RippleHintProps) => {
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const ripple3 = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Auto-detect if hint is onscreen (not at offscreen coordinates like -100)
  const isOnscreen = x >= 0 && x <= 1 && y >= 0 && y <= 1;

  useEffect(() => {
    if (isOnscreen) {
      opacity.value = withTiming(1, { duration: 300 });
      
      // Staggered ripple animations
      ripple1.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false
      );
      
      ripple2.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(0, { duration: 666 }), // delay
          withTiming(1, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          })
        ),
        -1,
        false
      );
      
      ripple3.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(0, { duration: 1333 }), // delay
          withTiming(1, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          })
        ),
        -1,
        false
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      ripple1.value = 0;
      ripple2.value = 0;
      ripple3.value = 0;
    }
  }, [isOnscreen]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: opacity.value,
  }));

  const getRippleProps = (progress: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => {
      const radius = 8 + progress.value * 30;
      const opacity = 1 - progress.value;
      
      return {
        r: radius,
        opacity: opacity * 0.8,
      };
    });
  };

  const ripple1Props = getRippleProps(ripple1);
  const ripple2Props = getRippleProps(ripple2);
  const ripple3Props = getRippleProps(ripple3);

  const centerX = x * width;
  const centerY = y * height;

  return (
    <Animated.View style={animatedStyle} pointerEvents="none">
      <Svg width={width} height={height}>
        {/* Ripple 1 */}
        <AnimatedCircle
          cx={centerX}
          cy={centerY}
          fill="none"
          stroke={color}
          strokeWidth="2"
          animatedProps={ripple1Props}
        />
        
        {/* Ripple 2 */}
        <AnimatedCircle
          cx={centerX}
          cy={centerY}
          fill="none"
          stroke={color}
          strokeWidth="2"
          animatedProps={ripple2Props}
        />
        
        {/* Ripple 3 */}
        <AnimatedCircle
          cx={centerX}
          cy={centerY}
          fill="none"
          stroke={color}
          strokeWidth="2"
          animatedProps={ripple3Props}
        />
        
        {/* Center dot */}
        <Circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill={color}
          opacity="0.8"
        />
      </Svg>
    </Animated.View>
  );
};

export default RippleHint;
