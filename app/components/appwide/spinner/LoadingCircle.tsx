import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
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
import { startIdleSpan } from "@sentry/react-native";

type Props = {
  loading: boolean;
  includeLabel?: boolean;
  label?: string;
  labelColor?: string;
  delay: number;
  size?: number; // 👈 added size prop for circle diameter
};

const LoadingCircle = ({
  loading,
  delay = 0,
 
  includeLabel = false,
  label = "",
  labelColor = "white",
  size = 400,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();

  const progress = useSharedValue(0.3);

  useEffect(() => {
    if (loading) {
      progress.value = withDelay(
        delay,
        withRepeat(
          withTiming(0.6, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );
    } else {
      progress.value = 0;
    }
  }, [loading, progress, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0.3, 0.6],
      [lightDarkTheme.overlayBackground, "transparent"]
    ),
          shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 2,
  }));

  if (!loading) return null;

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2, // 👈 makes it a circle
  
        },
        styles.circle, 
       animatedStyle,
      ]}
    >
      {includeLabel && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
  }, 
dropShadow:{
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 2,
    },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
});

export default LoadingCircle;
