import React, { useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";

const ModalMessage = ({
  title,
  body,
  confirmLabel = "Got it!",
  onConfirm,
  onClose,
  dismissOnBackdrop = true,
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
  dismissOnBackdrop?: boolean;
}) => {
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const { lightDarkTheme } = useLDTheme();

  const handleClose = () => {
    cancelAnimation(scale);
    cancelAnimation(opacity);
    cancelAnimation(backdropOpacity);

    scale.value = withSpring(0.88, { damping: 18, stiffness: 300 });
    opacity.value = withTiming(0, { duration: 120, easing: Easing.in(Easing.cubic) });
    backdropOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) });

    setTimeout(onClose, 160);
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  useEffect(() => {
    // Enter
    backdropOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) });
    scale.value = withSpring(1, { damping: 14, stiffness: 200, mass: 0.8 });
    opacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) });
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={dismissOnBackdrop ? handleClose : undefined}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      {/* Modal */}
      <View style={styles.centered} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.modal,
            { backgroundColor: lightDarkTheme.cardBackground ?? "#1c1c1c" },
            modalStyle,
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.75}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modal: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "SpaceGrotesk_700Bold",
    color: "#ffffff",
    lineHeight: 24,
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_400Regular",
    color: "#6a6a6a",
    lineHeight: 20,
    marginBottom: 22,
  },
  footer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#7FE629",
    borderRadius: 50,
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_700Bold",
    color: "#000000",
    letterSpacing: 0.1,
  },
});

export default ModalMessage;