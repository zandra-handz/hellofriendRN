import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextStyle,
} from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
import { AppFontStyles } from "@/app/styles/AppFonts";

type Props = {
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle?: TextStyle;
  buttonPadding?: number;
  placeholder?: string;
  onConfirm: (value: string) => void;
  validate?: (value: string) => string | null;
  showError?: boolean;
};

const OptionInputAdd: React.FC<Props> = ({
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  placeholder = "New category...",
  onConfirm,
  validate,
  showError = false,
}) => {
  const [value, setValue] = useState("");
  const error = validate ? validate(value) : null;

  const handleConfirm = () => {
    if (error || !value.trim()) return;
    onConfirm(value.trim());
    setValue("");
  };

  const handleCancel = () => {
    setValue("");
  };

  return (
    <View style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}>
      <View style={[styles.inner, { backgroundColor }]}>

        <View style={styles.left}>
          <SvgIcon name="plus" size={18} color={primaryColor} />
        </View>

        <View style={styles.valueColumn}>
          <TextInput
          autoFocus={true}
            style={[
              textStyle ?? AppFontStyles.subWelcomeText,
              styles.input,
              {
                color: primaryColor,
                borderBottomColor: error && showError ? "red" : "tranpsarent"
              },
            ]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={`${primaryColor}60`}
            onSubmitEditing={handleConfirm}
            returnKeyType="done"
          />
          {!!error && showError && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        <View style={styles.actionsColumn}>
          {value.length > 0 && (
            <>
              <Pressable onPress={handleCancel} style={styles.cancelButton}>
                <SvgIcon name="cancel" size={18} color={primaryColor} />
              </Pressable>
              <Pressable onPress={handleConfirm} disabled={!!error}>
                <SvgIcon
                  name="check"
                  size={18}
                  color={error ? "gray" : primaryColor}
                />
              </Pressable>
            </>
          )}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  left: {
    width: 24,
    alignItems: "center",
  },
  valueColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  errorText: {
    fontSize: 9,
    color: "red",
    marginTop: 2,
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 52,
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
  },
});

export default OptionInputAdd;