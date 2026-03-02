import { Pressable, StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

type Props = {  
  color: string;
  disabledColor: string;
  backgroundColor: string;
  disabledBackgroundColor: string;
  iconName?: string;
  disabledIconName?: string;
  timing: number;
  visible: boolean;
  enabled?: boolean;
  iconSize?: number;
  onPress: () => void;
};

const NextButton = ({
  color = "black",
  disabledColor = "black",
  backgroundColor = "limegreen",
  disabledBackgroundColor = "gray",
  iconName = "check",
  disabledIconName = "x",
  timing,
  visible,
  enabled = true,
  iconSize = 22,
  onPress,
}: Props) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const iconScale = useSharedValue(0);
  const enabledProgress = useSharedValue(enabled ? 1 : 0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withDelay(timing, withTiming(1, { duration: timing }));
      scale.value = withDelay(timing, withTiming(1, { duration: timing }));
      iconScale.value = withDelay(timing, withTiming(1, { duration: timing }));
    } else {
      opacity.value = withTiming(0, { duration: timing });
      scale.value = withTiming(0.85, { duration: timing });
      iconScale.value = withTiming(0, { duration: timing });
    }
  }, [visible]);

  React.useEffect(() => {
    enabledProgress.value = withTiming(enabled ? 1 : 0, { duration: timing });
  }, [enabled]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      enabledProgress.value,
      [0, 1],
      [disabledBackgroundColor, backgroundColor],
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const currentIconName = enabled ? iconName : disabledIconName;
  const currentColor = enabled ? color : disabledColor;

  return (
    <Pressable onPress={enabled ? onPress : undefined}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={iconStyle}>
          <SvgIcon name={currentIconName} size={iconSize} color={currentColor} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    width: 40,
    height: 40,

        shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 5000,
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default NextButton;