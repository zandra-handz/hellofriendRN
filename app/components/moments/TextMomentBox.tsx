import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const TextMomentBox = forwardRef(
  (
    {
      mountingText = "",
      triggerReFocus,
      onTextChange,
      helperText,
      isKeyboardVisible,
      welcomeTextStyle,
      primaryColor,
      value,
    },
    ref
  ) => {
    const textInputRef = useRef(null);
    const PADDING_TEXT_ABOVE_KEYBOARD = 80;

 
    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
      blur: () => textInputRef.current?.blur(),
      getValue: () => value,
    }));

    useEffect(() => {
      if (triggerReFocus) {
        console.log("triggerReFocus triggered in text moment box");
        textInputRef.current?.focus();
      }
    }, [triggerReFocus]);

    return (
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
        <View style={{ flex: 1 }}>
          {helperText && (
            <Text style={[styles.helperText, { color: primaryColor }]}>
              {helperText}
            </Text>
          )}
          <KeyboardAvoidingView
            style={[
              styles.textInputKeyboardAvoidContainer,
              { paddingBottom: isKeyboardVisible ? 120 : 0 },
            ]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TextInput
              ref={textInputRef}
              autoFocus={true}
              style={[
                welcomeTextStyle,
                {
                  color: primaryColor,
                  fontSize: 15,
                  lineHeight: 24,
                  flex: 1,
                  flexGrow: 1,
                  textAlignVertical: "top",
                  minHeight: 120,
                },
              ]}
              value={value}
              onChangeText={onTextChange}
              multiline={true}
            />
            <View
              style={{ width: "100%", height: PADDING_TEXT_ABOVE_KEYBOARD }}
            />
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.5,
  },
  textInputKeyboardAvoidContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default TextMomentBox;
