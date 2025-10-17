import React, { ReactNode, useEffect, useState, useMemo, useRef } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import GlobalPressable from "./GlobalPressable";
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

  const scale = useSharedValue(1);
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
    // scale animation is fode from global pressable
    scale.value = withSpring(0.65, {
      stiffness: 500, // higher = faster response
      damping: 30, // higher = less bounce
      mass: 0.5, // lower mass = quicker
    });
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
    // scale animation is fode from global pressable
    scale.value = withSpring(1, {
      stiffness: 600, // higher = faster response
      damping: 30, // higher = less bounce
      mass: 0.5, // lower mass = quicker
    });
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

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View
      style={[
        style,
        {
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50000,
        },
      ]}
    >
      <Pressable
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
        onPress={handleOnPress}
        onLongPress={onLongPress}
      >
        <Animated.View style={animatedButtonStyle}>{children}</Animated.View>
      </Pressable>
    </View>
  );
};

export default FriendTintPressable;
