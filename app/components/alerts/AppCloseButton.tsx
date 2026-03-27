// components/CloseButton.tsx
import React, { useCallback } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";
import FadeDisappear from "../moments/FadeDisappear";

interface CloseButtonProps {
  onPress: () => void;
  backgroundColor?: string;
  color: string;
  iconName?: string;
  label?: string;
  labelSide?: "left" | "right";
  hidden?: boolean;
  hideTiming?: number;
}

const AppCloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  color,
  backgroundColor = "transparent",
  iconName = "close",
  label,
  labelSide = "right",
  hidden,
  hideTiming = 200,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.65, { stiffness: 500, damping: 30, mass: 0.5 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { stiffness: 600, damping: 30, mass: 0.5 });
  }, []);

  const button = (
    <View pointerEvents="box-none" style={styles.closeButtonWrapper}>
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
    </View>
  );

  if (hidden !== undefined) {
    return (
      <FadeDisappear
        value={hidden}
        timing={hideTiming}
        zIndex={100}
        containerStyle={styles.fadeWrapper}
      >
        {button}
      </FadeDisappear>
    );
  }

  return button;
};

const styles = StyleSheet.create({
  fadeWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  closeButtonWrapper: {
    bottom: 30,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

export default AppCloseButton;