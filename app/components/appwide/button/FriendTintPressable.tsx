import React, { ReactNode, useEffect, useState, useMemo, useRef } from "react";
import { Pressable, View, StyleSheet } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

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
  handleNavAfterSelect,
  onPress,
  // onPressIn = () => console.log("on press in"),
  // onPressOut = () => console.log("on press out"),
  onLongPress,
  style,
  friendId,
  children,
}: Props) => {
  const quickPressTimeout = useRef(null);
  const QUICK_PRESS_THRESHOLD = 140; // ms

  const scale = useSharedValue(1);
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
    scale.value = withSpring(0.65, { stiffness: 500, damping: 30, mass: 0.5 });

    // Clear any previous timeout (safety)
    if (quickPressTimeout.current) {
      clearTimeout(quickPressTimeout.current);
    }

    quickPressTimeout.current = setTimeout(() => {
      // long press logic
      clearTimeout(quickPressTimeout.current);
      quickPressTimeout.current = undefined;
    }, QUICK_PRESS_THRESHOLD);

    setPressed(true);
    const { pageX, pageY } = event.nativeEvent;
    touchLocationX.value = pageX;
    touchLocationY.value = pageY;
    visibility.value = withTiming(1, { duration: 160 });
    scaleValue.value = withTiming(screenDiagonal + 900, { duration: 300 });

    setGradientColors([
      friendColors.theme_color_dark,
      friendColors.theme_color_light,
    ]);

    setTimeout(() => setPressed(false), 100);
  };

  const [pressed, setPressed] = useState(false);

  const handleOnPress = () => {
    setPressed(true);
    onPress(); // feels better/smoother here

    visibility.value = withTiming(1, { duration: 180 });
    scaleValue.value = withTiming(
      screenDiagonal + 900,
      { duration: 180 }, // 280
      (finished) => {
        if (finished) {
          runOnJS(handleNavAfterSelect)();
          // runOnJS(onPress)(); // use runOnJS to safely call JS code from the UI thread
        }
      }
    );
    // scaleValue.value = withTiming(screenDiagonal + 900, { duration: 160})
  };
  const handleOnPressOut = () => {
    scale.value = withSpring(1, { stiffness: 600, damping: 30, mass: 0.5 });

    if (quickPressTimeout.current) {
      // quick press detected → fire onPress
      clearTimeout(quickPressTimeout.current);
      quickPressTimeout.current = undefined;
      handleOnPress();
    } else if (!pressed) {
      visibility.value = withTiming(0, { duration: 300 });
      scaleValue.value = withTiming(0, { duration: 300 });
    } else {
      visibility.value = withDelay(300, withTiming(0, { duration: 300 }));
      scaleValue.value = withDelay(300, withTiming(0, { duration: 1000 }));
    }
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
        styles.container
      ]}
    >
      <Pressable
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
        // onPress={handleOnPress}
        onLongPress={onLongPress}
      >
        <Animated.View style={animatedButtonStyle}>{children}</Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50000,
  }, 
});

export default FriendTintPressable;
