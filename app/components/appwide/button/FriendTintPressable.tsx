import React, { ReactNode, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ColorValue } from "react-native";
 
type Props = {
  onPress: () => void;
  friendId: number;
  startingColor: string;
  style: object;
  children: ReactNode;
  useFriendColors?: boolean; // just here to be the same as GradientBackground logic to avoid confusion
  reverse?: boolean; // reverses gradient, mostly just here for experimenting
};

const FriendTintPressable = ({
  touchLocationX,
  touchLocationY,
  friendList,
  friendColorValues,
  screenDiagonal,
  visibility,
  scaleValue,
  setGradientColors,
  onPress,
  onPressIn = () => console.log("on press in"),
  onPressOut = () => console.log("on press out"),
  onLongPress,
  style,
  friendId,
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

  const handleOnPressIn = (event) => {
    const { pageX, pageY, locationX, locationY } = event.nativeEvent;
    touchLocationX.value = pageX;
    touchLocationY.value = pageY;
    visibility.value = withTiming(1, { duration: 0 });
  
    scaleValue.value = withTiming(screenDiagonal + 800, { duration: 200 });
    // console.log("Screen position:", pageX, pageY);
    // console.log("Within element:", locationX, locationY);
    // friendColorValues.value = [
    //   friendColors.theme_color_dark,
    //   friendColors.theme_color_light,
    // ];
    setGradientColors([
      friendColors.theme_color_dark,
      friendColors.theme_color_light,
    ]);

    console.log("friend colors set", friendColorValues.value);

    // scale.value = withSpring(0.95, { duration: 100 });
    // gradientScale.value = withTiming(1.4, { duration: 50 });
    // transition.value = withTiming(1, { duration: 100 });
    onPressIn();
  };

  const handleOnPress = () => { 
    // scaleValue.value = withTiming(screenDiagonal + 700, { duration: 80 });


    onPress();
    
  };

  const handleOnPressOut = (event) => {

    // visibility.value = withTiming(0, { duration: 300 });
    // scaleValue.value = withTiming(0, { duration: 300 });

    onPressOut();
  };

  // const direction = useMemo(() => {
  //   if (useFriendColors) return [0, 0, 1, 0];
  //   if (reverse) return [0, 0, 1, 1];
  //   return [0, 1, 1, 0];
  // }, [useFriendColors, reverse]);

  // const highlightColors = useMemo<[ColorValue, ColorValue]>(() => {
  //   if (
  //     friendColors &&
  //     friendColors?.theme_color_dark &&
  //     friendColors?.theme_color_light
  //   ) {
  //     return [friendColors.theme_color_dark, friendColors.theme_color_light];
  //   } else {
  //     return ["#4caf50", "#a0f143"];
  //   }
  // }, [friendColors]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // transform: [{ scale: scale.value }],
    };
  });

  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      opacity: transition.value,
      transform: [{ scale: gradientScale.value }],
    };
  });

  return (
    <Pressable
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
       onPress={handleOnPress}
     onLongPress={onLongPress}
    //     onPress={() => {
    //   // Delay the actual onPress by 200ms
    //   setTimeout(() => {
    //     handleOnPress?.();
    //   }, 200);
    // }}
      style={[
        style,
        {
          // backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50000,
        },
      ]}
    > 
      {/* <Animated.View style={[animatedStyle]}>{children}</Animated.View> */}
            <Animated.View>{children}</Animated.View>
    </Pressable>
  );
};

export default FriendTintPressable;
