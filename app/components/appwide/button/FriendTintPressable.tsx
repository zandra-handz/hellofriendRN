import React, { ReactNode, useEffect, useState, useMemo, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

import { ColorValue } from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";

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
  const quickPressTimeout = useRef(null);
  const QUICK_PRESS_THRESHOLD = 150; // ms
  const { navigateBack, navigateToHome } = useAppNavigations();

  // const scale = useSharedValue(1);
  // const gradientScale = useSharedValue(0);
  // const transition = useSharedValue(0);

  const friendColors = friendList.find(
    (friend) => Number(friendId) === Number(friend.id)
  );

  useEffect(() => {
  return () => {
    if (quickPressTimeout.current) {
      clearTimeout(quickPressTimeout.current);
      quickPressTimeout.current = undefined;
    }
  };
}, []);

  const handleOnPressIn = (event) => {

      quickPressTimeout.current = setTimeout(() => {
    console.log("This is a long press!");
    clearTimeout(quickPressTimeout.current);
    quickPressTimeout.current = undefined; // ✅ clear safely
  }, QUICK_PRESS_THRESHOLD);
 
    setPressed(true);
    console.log("pressed innnn");
    const { pageX, pageY, locationX, locationY } = event.nativeEvent;
    touchLocationX.value = pageX;
    touchLocationY.value = pageY;
    visibility.value = withTiming(1, { duration: 160 });
    scaleValue.value = withTiming(screenDiagonal + 900, { duration: 300 });

    setGradientColors([
      friendColors.theme_color_dark,
      friendColors.theme_color_light,
    ]);
    setTimeout(() => {
      setPressed(false);
    }, 100);

    // scale.value = withSpring(0.95, { duration: 100 });
    // gradientScale.value = withTiming(1.4, { duration: 50 });
    // transition.value = withTiming(1, { duration: 100 });
    // onPressIn();
  };

  const [pressed, setPressed] = useState(false);

  const handleOnPress = () => {
    setPressed(true);
    console.log("pressed");
    // scaleValue.value = withTiming(screenDiagonal + 700, { duration: 80 });
    // const { pageX, pageY, locationX, locationY } = event.nativeEvent;
    // touchLocationX.value = pageX;
    // touchLocationY.value = pageY;

    visibility.value = withTiming(1, { duration: 160 });
    scaleValue.value = withTiming(
      screenDiagonal + 900,
      { duration: 280 },
      (finished) => {
        if (finished) {
          runOnJS(navigateToHome)();
          runOnJS(onPress)(); // use runOnJS to safely call JS code from the UI thread
        }
      }
    );
  };

  const handleOnPressOut = () => {
    if (quickPressTimeout.current) {
      clearTimeout(quickPressTimeout.current);
      quickPressTimeout.current = undefined;
      console.log("Quick press detected!");
      handleOnPress();
    } else if (!pressed) {
      console.log("not pressed");
      visibility.value = withTiming(0, { duration: 300 });
      scaleValue.value = withTiming(0, { duration: 300 });
    } else {
      visibility.value = withDelay(300, withTiming(0, { duration: 300 }));
      scaleValue.value = withDelay(300, withTiming(0, { duration: 1000 }));
    }

    // onPressOut();
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

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ scale: scale.value }],
  //   };
  // });

  // const animatedColorStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: transition.value,
  //     transform: [{ scale: gradientScale.value }],
  //   };
  // });

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
          width: '100%',
     
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
