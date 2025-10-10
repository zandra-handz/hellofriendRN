import React, {   ReactNode, useMemo, useEffect, useState } from "react";
import { View, ViewStyle, StyleProp, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import manualGradientColors from "@/app/styles/StaticColors";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GradientBackgroundProps {
  useFriendColors?: boolean | null;
  friendColorLight?: string | null;
  friendColorDark?: string | null;
  reverse?: boolean;
  additionalStyles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  useFriendColors,
  friendColorLight = "white",
  friendColorDark = "red",
  additionalStyles,
  children,
}) => {
  const startColor = manualGradientColors.lightColor;
  const endColor = manualGradientColors.darkColor;

  const direction = useMemo(() => {
    if (useFriendColors) return [0, 0, 1, 0];
    return [0, 1, 1, 0];
  }, [useFriendColors]);

  const initialColors: [ColorValue, ColorValue] =
    useFriendColors && friendColorDark && friendColorLight
      ? [friendColorDark, friendColorLight]
      : [startColor, endColor];

  const [currentColors, setCurrentColors] = useState(initialColors);
  const [previousColors, setPreviousColors] = useState(initialColors);

  const transition = useSharedValue(1);

  useEffect(() => {
    const newColors: [ColorValue, ColorValue] = [
      friendColorDark ?? startColor,
      friendColorLight ?? endColor,
    ];

    if (!currentColors.every((c, i) => c === newColors[i])) {
      // Update previous colors first
      setPreviousColors(currentColors);

      // Reset opacity immediately the moment previousColors is updated
      transition.value = 0;

      // Update current colors in the next frame
      requestAnimationFrame(() => {
        setCurrentColors(newColors);

        // Animate opacity to fade in the new gradient
        transition.value = withTiming(1, { duration: 400 });
      });
    }
  }, [friendColorDark, friendColorLight]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: transition.value,
  }));

  const flattenMainStyle = StyleSheet.flatten([styles.container, additionalStyles])

  return (
    // <Animated.View style={flattenMainStyle}>
        <View style={flattenMainStyle}> 
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
      </View>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default React.memo(GradientBackground);