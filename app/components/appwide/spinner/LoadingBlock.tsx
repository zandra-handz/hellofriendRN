import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  interpolateColor,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useLDTheme } from "@/src/context/LDThemeContext";

type Props = {
  loading: boolean;
  includeLabel?: boolean;
  label?: string;
  labelColor?: string;
  delay: number;
  onBlack: boolean;
};

const LoadingBlock = ({
  loading,
  delay=0,
  includeLabel = false,
  label = "",
  labelColor = "white",
  borderRadius = 0,
  onBlack = false,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();
 
  const progress = useSharedValue(0.3);

  useEffect(() => {
    if (loading) {
      progress.value = withDelay(delay, withRepeat(
        withTiming(0.6, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true // reverses the animation
      ));
    } else {
      progress.value = 0; // reset when not loading
    }
  }, [loading, progress, delay]);


  const color = onBlack ? lightDarkTheme.lighterOverlayBackground : lightDarkTheme.overlayBackground;

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0.3, 0.6],
      [color, "transparent"]
    ),
  }));

  if (!loading) return null;

  return (
    <Animated.View style={[styles.overlay, animatedStyle, { borderRadius: borderRadius}]}>
      {includeLabel && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
});

export default LoadingBlock;
