import React, { ReactNode, useCallback } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  onPress?: () => void;
  onLongPress?: () => void;
  hitSlop?: number;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  disableBurst?: boolean; // skip burst effect when not needed
};

const GlobalPressable = ({
  onPress,
  onLongPress,
  hitSlop = 10,
  zIndex = 1,
  style,
  children,
  disableBurst = true, // default OFF for perf
}: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.65, {
      stiffness: 500,
      damping: 30,
      mass: 0.5,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      stiffness: 600,
      damping: 30,
      mass: 0.5,
    });
  }, []);

  return (
    <Pressable
      hitSlop={hitSlop}
      style={[style, { zIndex }]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[animatedStyle, styles.innerContainer]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center", 
  },
});

export default React.memo(GlobalPressable);
 