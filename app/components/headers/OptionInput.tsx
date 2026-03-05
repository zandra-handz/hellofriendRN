import React from "react";
import { View, TextInput, StyleSheet, TextStyle } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  buttonPadding?: number;
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<TextInput>;
  onFocus?: () => void;
  onBlur?: () => void;
  inputMode?: "text" | "email" | "numeric" | "tel" | "search" | "url" | "none" | "decimal";
  keyboardType?: string;
  autoComplete?: string;
  enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
  autoFocus?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const OptionInput = ({
  value,
  onChangeText,
  placeholder,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  secureTextEntry = false,
  onSubmitEditing,
  inputRef,
  onFocus,
  onBlur,
  inputMode,
  keyboardType,
  autoComplete,
  enterKeyHint,
  autoFocus = false,
  accessibilityLabel,
  accessibilityHint,
}: Props) => {
  return (
    <View style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={primaryColor}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        onBlur={onBlur}
        inputMode={inputMode}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        enterKeyHint={enterKeyHint}
        autoFocus={autoFocus}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        importantForAccessibility="yes"
        accessible={true}
        style={[
          textStyle,
          styles.input,
          {
            color: primaryColor,
            backgroundColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
  },
  input: {
    borderRadius: 6,
    padding: 10,
    width: "100%",
  },
});

export default OptionInput;