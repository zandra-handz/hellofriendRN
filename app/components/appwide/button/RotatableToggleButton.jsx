import { useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const RotatableToggleButton = ({
  expanded,
  onPress,
  icon: Icon,
  iconSize = 52,
  backgroundColor,
  iconColor,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 1 : 0, { duration: 100 });
  }, [expanded]);
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value * -180}deg` }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.circleButton, { backgroundColor: backgroundColor }]}
    >
      <Animated.View style={animatedStyle}>
        {Icon && <Icon width={iconSize} height={iconSize} color={iconColor} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 35,
    zIndex: 3000,
    elevation: 3000,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RotatableToggleButton;
