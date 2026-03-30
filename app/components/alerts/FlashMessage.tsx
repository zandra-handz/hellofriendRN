// FlashMessage.tsx
import React, { useEffect, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlainSafeView from "../appwide/format/PlainSafeView";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SvgIcon from "@/app/styles/SvgIcons";
import { AppFontStyles } from "@/app/styles/AppFonts";
import manualGradientColors from "@/app/styles/StaticColors";

const FlashMessage = ({
  message,
  isInsideModal = false,
  iconName = "check_circle",
  error = false,
  duration = 2000,
  onClose,
}: {
  message: string;
  isInsideModal?: boolean;
  iconName?: string;
  error?: boolean;
  duration?: number;
  onClose: () => void;
}) => {
  // start a bit higher so movement is obvious but still fast
  const translateY = useSharedValue(-18);
  const opacity = useSharedValue(0);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { lightDarkTheme } = useLDTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // stop any previous animations if message retriggers quickly
    cancelAnimation(translateY);
    cancelAnimation(opacity);

    // ENTER (fast)
    translateY.value = withTiming(0, {
      duration: 140,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 110,
      easing: Easing.out(Easing.quad),
    });

    const timeout = setTimeout(() => {
      // EXIT (fast)
      translateY.value = withTiming(-18, {
        duration: 120,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 100,
        easing: Easing.in(Easing.quad),
      });

      // close right after the exit finishes
      closeTimeoutRef.current = setTimeout(onClose, 130);
    }, duration);

    return () => {
      clearTimeout(timeout);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [message, error, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const pillBg = error
    ? lightDarkTheme.darkerBackground
    : manualGradientColors.lightColor;

  const textColor = error
    ? lightDarkTheme.dangerZoneText
    : manualGradientColors.homeDarkColor;

  return (
    <PlainSafeView
      turnSafeOff={true}
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlay,
        { paddingTop: insets.top + 8 },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[styles.pill, animatedStyle, { backgroundColor: pillBg }]}
      >
        <Text
          style={[
            AppFontStyles.subWelcomeText,
            styles.messageText,
            { color: textColor, fontFamily: "Poppins_700Bold" },
          ]}
          numberOfLines={2}
        >
          {error ? "Something went wrong" : message}
        </Text>

        <SvgIcon
          name={error ? "alert_circle" : iconName}
          size={20}
          color={textColor}
          style={styles.icon}
        />
      </Animated.View>
    </PlainSafeView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 999999,
    pointerEvents: "none",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "88%",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 50,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  messageText: { flex: 1 },
  icon: { flexShrink: 0 },
});

export default FlashMessage;