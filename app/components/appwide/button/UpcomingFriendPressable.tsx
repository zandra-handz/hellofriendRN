import React, { ReactNode, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ColorValue } from "react-native"; 

// HARD CODED COLOR 
import { LinearGradient } from "expo-linear-gradient";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

 
type Props = {
  onPress: () => void;
  friendId: number;
  startingColor: string;
  style: object;
  children: ReactNode;
  useFriendColors?: boolean; // just here to be the same as GradientBackground logic to avoid confusion
  reverse?: boolean; // reverses gradient, mostly just here for experimenting
};
 

const UpcomingFriendPressable = ({
  friendList,
  onPress,
  onPressIn=() => console.log('on press in'),
  onPressOut=() => console.log('on press out'),
  onLongPress,
  style,
  friendId,
  startingColor,
  children,
  useFriendColors = true,
  reverse = false,
}: Props) => { 

  const scale = useSharedValue(1);
  const gradientScale = useSharedValue(0);
  const transition = useSharedValue(0);

  const friendColors = friendList.find(
    (friend) => Number(friendId) === Number(friend.id)
  );

  const handleOnPressIn = () => {
            scale.value = withSpring(0.95, {duration: 100});
        gradientScale.value = withTiming(1.4,  { duration: 50 });
        transition.value = withTiming(1, {duration: 100});
       onPressIn();
  }


    const handleOnPressOut = () => {

        //           scale.value = withSpring(0.95, {duration: 100});
        // gradientScale.value = withTiming(1.4,  { duration: 50 });
        // transition.value = withTiming(1, {duration: 100});
        scale.value = withSpring(1);
        transition.value = withTiming(0);
         gradientScale.value = withTiming(0);
        onPressOut();
        // onPressIn();
  }

  const direction = useMemo(() => {
    if (useFriendColors) return [0, 0, 1, 0];
    if (reverse) return [0, 0, 1, 1];
    return [0, 1, 1, 0];
  }, [useFriendColors, reverse]);

  const highlightColors = useMemo<[ColorValue, ColorValue]>(() => {
    if (friendColors && friendColors?.theme_color_dark && friendColors?.theme_color_light) {
      return [friendColors.theme_color_dark, friendColors.theme_color_light];
    } else {
      return ["#4caf50","#a0f143" ];
    }
  }, [friendColors]);

  // transition.value = 0;

  // transition.value = withTiming(1, { duration: 600 });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      opacity: transition.value, transform: [{ scale: gradientScale.value }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[style, { backgroundColor: 'transparent'}]}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
    >
      <AnimatedLinearGradient
        colors={highlightColors}
        start={{ x: direction[0], y: direction[1] }}
        end={{ x: direction[2], y: direction[3] }}
        style={[StyleSheet.absoluteFill, animatedColorStyle, style]}
      /> 
      <Animated.View style={[animatedStyle]}>{children}</Animated.View>
 
    </Pressable>
  );
};

export default UpcomingFriendPressable;