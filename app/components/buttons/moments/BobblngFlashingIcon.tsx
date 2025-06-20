import { View, Text, DimensionValue, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import BobbingAnim from "@/app/animations/BobbingAnim";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

import { MaterialIcons } from "@expo/vector-icons";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

interface Props {
  icon: React.ReactElement;
  size: DimensionValue;
  padding: DimensionValue;
  bobDistance: number;
  bobDuration: number;
  pulseDuration: number;
  pulseStartColor?: string;
  pulseEndColor?: string;
}

const BobblngFlashingIcon: React.FC<Props> = ({
  icon,
  size = 30,
  padding,
  bobDistance = 2,
  bobDuration = 800,
  pulseDuration = 2000,
  pulseStartColor,
  pulseEndColor,
}) => {
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const { themeStyles, manualGradientColors } = useGlobalStyle();

  // not sure how to add animations to Pressable
  //   const AnimatedPressable =
  // Animated.createAnimatedComponent(Pressable);

  const pulse = useSharedValue(0);
  const startColor = useSharedValue(pulseStartColor || manualGradientColors.lightColor);
  const endColor = useSharedValue(pulseEndColor || manualGradientColors.darkColor);
  const textColor = useSharedValue("green");

//   pulse.value = withRepeat(
//     withTiming(1, { duration: pulseDuration }),
//     -1,
//     true
//   );

  useEffect(() => {
  pulse.value = withRepeat(withTiming(1, { duration: pulseDuration }), -1, true);
}, []);

  const colorPulseStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      pulse.value,
      [0, .5],
      [startColor.value, endColor.value]
    );

    return {
      backgroundColor,
      color: textColor.value,
    };
  });

  return ( 
        
    <BobbingAnim bobbingDistance={bobDistance} duration={bobDuration}>
      <Animated.View
        style={[
          colorPulseStyle,
          { width: size, height: size, alignItems: 'center', justifyContent: 'center', borderRadius: size / 2 },
        ]}
      >
        {icon && icon}
      </Animated.View>
    </BobbingAnim>
     
  );
};

export default BobblngFlashingIcon;
