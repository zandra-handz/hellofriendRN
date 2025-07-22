
import React, { ReactNode } from 'react'
import { Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
type Props = {
    onPress: () => void;
    style: object;
    children: ReactNode;
}

const GlobalPressable = ({onPress, style, children}: Props) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
        }
    });

  return (
    <Pressable
      onPress={onPress}
      style={style}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

export default GlobalPressable;

 