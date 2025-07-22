import React, { ReactNode, useMemo, useEffect, useState } from "react";
import { ViewStyle, StyleProp, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GradientBackgroundProps {
  useFriendColors?: boolean;
  startColor?: string;
  endColor?: string;
  reverse?: boolean;
  additionalStyles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  useFriendColors = false,
  startColor,
  endColor,
  reverse = false,
  additionalStyles,
  children,
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const { manualGradientColors } = useGlobalStyle();

  const direction = useMemo(() => {
    if (useFriendColors) return [0, 0, 1, 0];
    if (reverse) return [0, 0, 1, 1];
    return [0, 1, 1, 0];
  }, [useFriendColors, reverse]);

  // Memoized next gradient colors
  const nextColors = useMemo(() => {
    return [
      useFriendColors ? themeAheadOfLoading.darkColor : startColor || manualGradientColors.lightColor,
      useFriendColors ? themeAheadOfLoading.lightColor : endColor || manualGradientColors.darkColor,
    ];
  }, [useFriendColors, themeAheadOfLoading, startColor, endColor, manualGradientColors]);

  const [currentColors, setCurrentColors] = useState(nextColors);
  const [previousColors, setPreviousColors] = useState(nextColors);

  const transition = useSharedValue(1);

  useEffect(() => {
    // Fade from previous to next
    setPreviousColors(currentColors);
    setCurrentColors(nextColors);
    transition.value = 0;

    transition.value = withTiming(1, { duration: 600 }); // You can customize timing
  }, [nextColors]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: transition.value,
  }));

  return (
    <Animated.View style={[styles.container, additionalStyles]}>
      <LinearGradient
        colors={previousColors}
        start={{ x: direction[0], y: direction[1] }}
        end={{ x: direction[2], y: direction[3] }}
        style={StyleSheet.absoluteFill}
      />
      <AnimatedLinearGradient
        colors={currentColors}
        start={{ x: direction[0], y: direction[1] }}
        end={{ x: direction[2], y: direction[3] }}
        style={[StyleSheet.absoluteFill, animatedStyle]}
      />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default GradientBackground;
