import React, { ReactNode } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
type Props = {
  onPress?: () => void;
  onLongPress?: () => void;
  hitSlop?: number;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const GlobalPressable = ({
  onPress,
  onLongPress,
  hitSlop = 10,
  zIndex = 1,
  style,
  children,
}: Props) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Pressable
      hitSlop={hitSlop}
      style={{ zIndex: zIndex }}
      onPress={onPress ? onPress : null}
      onLongPress={onLongPress ? onLongPress : null}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
};

export default GlobalPressable;
