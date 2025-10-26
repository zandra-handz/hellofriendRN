import React, { ReactNode, useMemo, useEffect, useState } from "react";
import { ViewStyle, StyleProp, StyleSheet, Vibration } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue } from "react-native";
 
import Animated, {
  useSharedValue,
  withSequence,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  runOnJS,
} from "react-native-reanimated";
 

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GradientBackgroundForFidgetProps {
  switchColorSet?: boolean | null;
  firstSetColorLight?: string | null;
  firstSetColorDark?: string | null;
  reverse?: boolean;
  additionalStyles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const GradientBackgroundForFidget: React.FC<
  GradientBackgroundForFidgetProps
> = ({
  switchColorSet,
  useVibration = false,
  speed = 600,
  firstSetColorLight = "white",
  firstSetColorDark = "red",

  firstSetDirection = [0,1,1,0], //[0, 0, 1, 0],

  secondSetColorLight = "black",
  secondSetColorDark = "orange",

  secondSetDirection = [0, 1, 1, 0],
  additionalStyles,
  children,
  borderRadius=0,
  
}) => {

 

  const direction = useMemo(() => {
    return [...firstSetDirection, ...secondSetDirection];
 
  }, [  firstSetDirection, secondSetDirection]);

  const initialColors: [ColorValue, ColorValue] =
    switchColorSet && firstSetColorDark && firstSetColorLight
      ? [firstSetColorDark, firstSetColorLight]
      : [secondSetColorLight, secondSetColorDark];

  const [currentColors, setCurrentColors] = useState(initialColors);
  const [previousColors, setPreviousColors] = useState(initialColors);

  const transition = useSharedValue(1);

  useEffect(() => {
    const newColors: [ColorValue, ColorValue] = [
      firstSetColorDark ?? secondSetColorLight,
      firstSetColorLight ?? secondSetColorDark,
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
        transition.value = withRepeat(
        withSequence(
          withTiming(1, { duration: speed }, () => {
            // Call vibration on JS thread after first timing
         //   if (useVibration) runOnJS(Vibration.vibrate)(100);
          }),
          withTiming(0, { duration: speed }, () => {
            // Call vibration on JS thread after second timing
            if (useVibration) runOnJS(Vibration.vibrate)(100);
          })
        ),
          -1,
          false
        );
      });
    }
  }, [firstSetColorDark, firstSetColorLight]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: transition.value,
  }));

  return (
    <Animated.View style={[styles.container, additionalStyles, {borderRadius: borderRadius}]}>
      <LinearGradient

        colors={previousColors}
        start={{ x: direction[0], y: direction[1] }}
        end={{ x: direction[2], y: direction[3] }}
        style={[StyleSheet.absoluteFill, {borderRadius: borderRadius}]}
      />
      <AnimatedLinearGradient
        colors={currentColors}
        start={{ x: direction[4], y: direction[5] }}
        end={{ x: direction[6], y: direction[7] }}
        style={[StyleSheet.absoluteFill, animatedStyle, {borderRadius: borderRadius}]}
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

export default React.memo(GradientBackgroundForFidget);
