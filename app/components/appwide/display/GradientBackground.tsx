import React, { ReactNode, useMemo, useEffect, useState } from "react";
import { ViewStyle, StyleProp, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";  
import { ColorValue } from "react-native"; 
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GradientBackgroundProps {
  useFriendColors?: boolean | null;
  friendColorLight?: string | null;
  friendColorDark?: string | null;
  startColor: string;
  endColor: string;
  reverse?: boolean;
  additionalStyles?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  useFriendColors = false,
  startColor,
  endColor,
  reverse = false,
  friendColorLight='white',
  friendColorDark='red',
  additionalStyles,
  children,
}) => {
  // const { themeAheadOfLoading } = useFriendStyle();
  // const { manualGradientColors } = useGlobalStyle();

  const direction = useMemo(() => {
    if (useFriendColors) return [0, 0, 1, 0];
    if (reverse) return [0, 0, 1, 1];
    return [0, 1, 1, 0];
  }, [useFriendColors, reverse]);



console.log('gradient background0000');
const getInitialColors = (): [ColorValue, ColorValue] => [
  useFriendColors && friendColorDark
    ? friendColorDark
    : startColor, // || manualGradientColors.lightColor,
  useFriendColors && friendColorLight 
    ? friendColorLight
    : endColor, // || manualGradientColors.darkColor,
];

const [currentColors, setCurrentColors] = useState<readonly [ColorValue, ColorValue]>(getInitialColors);
const [previousColors, setPreviousColors] = useState<readonly [ColorValue, ColorValue]>(getInitialColors);

  const transition = useSharedValue(1);

  const nextColors = useMemo<[ColorValue, ColorValue]>(() => [
  useFriendColors && friendColorDark 
    ? friendColorDark
    : startColor,
  useFriendColors && friendColorLight
    ? friendColorLight
    : endColor // || manualGradientColors.darkColor,
], [useFriendColors, friendColorLight, friendColorDark, startColor, endColor]);


  // useEffect(() => {
  //   // Fade from previous to next
  //   console.log('fading friend');
  //   setPreviousColors(currentColors);
  //   setCurrentColors(nextColors);
  //   transition.value = 0;

  //   transition.value = withTiming(1, { duration: 400 }); // You can customize timing
  // }, [nextColors]);


  useEffect(() => {
  console.log("fading friend", currentColors, nextColors);
  setPreviousColors(currentColors);
  setCurrentColors(nextColors);
  transition.value = 0;
  transition.value = withTiming(1, { duration: 400 });
}, [nextColors[0], nextColors[1]]);

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
