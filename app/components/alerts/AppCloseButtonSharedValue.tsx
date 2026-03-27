// components/AppCloseButtonSharedValue.tsx
import React, { useCallback } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  SharedValue,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";

interface Props {
  onPress: () => void;
  backgroundColor?: string;
  color: string;
  iconName?: string;
  label?: string;
  labelSide?: "left" | "right";
  hiddenValue: SharedValue<boolean>;
  hideTiming?: number;
}

const AppCloseButtonSharedValue: React.FC<Props> = ({
  onPress,
  color,
  backgroundColor = "transparent",
  iconName = "close",
  label,
  labelSide = "right",
  hiddenValue,
  hideTiming = 200,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const hiddenStyle = useAnimatedStyle(() => ({
    opacity: withTiming(hiddenValue.value ? 1 : 0, { duration: hideTiming }),
    pointerEvents: hiddenValue.value ? "auto" : "none",
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.65, { stiffness: 500, damping: 30, mass: 0.5 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { stiffness: 600, damping: 30, mass: 0.5 });
  }, []);

  return (
    <Animated.View pointerEvents="box-none" style={[styles.closeButtonWrapper, hiddenStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.closeButton,
          { backgroundColor },
          label ? styles.closeButtonWithLabel : styles.closeButtonNoLabel,
        ]}
      >
        <Animated.View style={[styles.innerContent, animatedStyle]}>
          {label && labelSide === "left" && (
            <Text style={[styles.label, { color }]}>{label}</Text>
          )}
          <SvgIcon name={iconName} color={color} size={24} />
          {label && labelSide === "right" && (
            <Text style={[styles.label, { color }]}>{label}</Text>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  closeButtonWrapper: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    elevation: 99999,
  },
  closeButton: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  closeButtonNoLabel: {
    width: 60,
  },
  closeButtonWithLabel: {
    minWidth: 60,
    paddingHorizontal: 20,
  },
  innerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AppCloseButtonSharedValue;