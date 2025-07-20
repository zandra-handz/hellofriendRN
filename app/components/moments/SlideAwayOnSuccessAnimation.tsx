import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { StyleSheet } from "react-native";
 

const SlideAwayOnSuccess = ({
  localItem,
  contextItem,
  contextItemUpdateMutation,
  height,
  marginBottom,
  borderRadius,
  borderColor,
  children,
}) => {
  const translateX = useSharedValue(0);
  useEffect(() => {
    if (
      contextItemUpdateMutation.isSuccess &&
      localItem &&
      localItem?.id === contextItem?.id
    ) {
      translateX.value = withTiming(500, {
        duration: 200,
        easing: Easing.ease,
      });
    }
  }, [contextItemUpdateMutation.isSuccess, localItem?.id, contextItem?.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          height: height,
          marginBottom: marginBottom,
          borderRadius: borderRadius,
          borderColor: borderColor,
         
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default SlideAwayOnSuccess;
