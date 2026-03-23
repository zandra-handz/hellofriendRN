import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useLDTheme } from "@/src/context/LDThemeContext";

const ModalInput = ({
  title,
  body,
  placeholder = "Enter a value...",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  initialValue = "",
  onConfirm,
  onCancel,
  onClose,
  validate,
  dismissOnBackdrop = false,
  keyboardType = "default",
}: {
  title: string;
  body?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  initialValue?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  onClose: () => void;
  validate?: (value: string) => string | null;
  dismissOnBackdrop?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const { lightDarkTheme } = useLDTheme();

  const error = validate ? validate(value) : null;

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
    if (error || !value.trim()) return;
    onConfirm?.(value.trim());
    handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  useEffect(() => {
    backdropOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) });
    scale.value = withSpring(1, { damping: 14, stiffness: 200, mass: 0.8 });
    opacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) });

    // Small delay so the modal is visible before keyboard appears
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
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

          {/* Input row */}
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                error ? styles.inputError : styles.inputNormal,
              ]}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor="#444"
              onSubmitEditing={handleConfirm}
              returnKeyType="done"
              selectionColor="#7FE629"
              keyboardType={keyboardType}
            />
            {!!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.65}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={error || !value.trim() ? 1 : 0.75}
              style={[
                styles.confirmButton,
                (error || !value.trim()) && styles.confirmButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.confirmText,
                  (error || !value.trim()) && styles.confirmTextDisabled,
                ]}
              >
                {confirmLabel}
              </Text>
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
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    color: "#ffffff",
  },
  inputNormal: {
    borderColor: "#2a2a2a",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk_400Regular",
    color: "red",
    marginTop: 6,
    marginLeft: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    borderRadius: 50,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_700Bold",
    color: "#6a6a6a",
    letterSpacing: 0.1,
  },
  confirmButton: {
    backgroundColor: "#7FE629",
    borderRadius: 50,
    paddingVertical: 9,
    paddingHorizontal: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: "#2a2a2a",
  },
  confirmText: {
    fontSize: 13,
    fontFamily: "SpaceGrotesk_700Bold",
    color: "#000000",
    letterSpacing: 0.1,
  },
  confirmTextDisabled: {
    color: "#555555",
  },
});

export default ModalInput;