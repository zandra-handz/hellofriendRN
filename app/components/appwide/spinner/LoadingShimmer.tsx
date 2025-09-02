import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useLDTheme } from "@/src/context/LDThemeContext";

type Props = {
  loading: boolean;
  includeLabel?: boolean;
  label?: string;
  labelColor?: string;
  duration?: number;
};

const LoadingShimmer = ({
  loading,
  includeLabel = false,
  label = "",
  labelColor = "white",
  duration = 2000,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const progress = useSharedValue(0);

  // Animate progress 0 → 1 repeatedly
  useEffect(() => {
    if (loading) {
      progress.value = withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      progress.value = 0;
    }
  }, [loading, progress, duration]);

  // Animated style: move gradient from -50% (offscreen top) → +50% (offscreen bottom)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: progress.value * 2000 - 1000, // adjust 200 = total travel, -100 = start offscreen
      },
    ],
  }));

  if (!loading) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={["transparent", lightDarkTheme.overlayBackground, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
         locations={[0, 0.7, 1]} 
        style={{ flex: 1 }}
      />
      {includeLabel && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
  },
});

export default LoadingShimmer;
