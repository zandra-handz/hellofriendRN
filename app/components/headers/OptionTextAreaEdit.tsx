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

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  icon?: React.ReactElement;
  buttonPadding?: number;
  placeholder?: string;
  numberOfLines?: number;
  validate?: (value: string) => string | null;
  onConfirm: () => void;
};

const OptionTextAreaEdit: React.FC<Props> = ({
  label,
  value,
  onValueChange,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  icon,
  buttonPadding = 4,
  placeholder = "None",
  numberOfLines = 4,
  validate,
  onConfirm,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const error = validate ? validate(value) : null;

  const handleConfirm = () => {
    if (error) return;
    onConfirm();
    setShowEdit(false);
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  return (
    <Pressable
      onPress={() => !showEdit && setShowEdit(true)}
      style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      <View style={[styles.inner, { backgroundColor }]}>

        {/* top row: label + actions */}
        <View style={styles.topRow}>
          <View style={styles.left}>
            {!!icon && <View style={styles.iconWrap}>{icon}</View>}
            {!!label && (
              <View style={styles.labelColumn}>
                <Text
                  style={[textStyle, styles.label, { color: primaryColor }]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                {showEdit && !!error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.actionsColumn}>
            {!showEdit ? (
              <Pressable onPress={() => setShowEdit(true)}>
                <SvgIcon name="pencil" size={18} color={primaryColor} />
              </Pressable>
            ) : (
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

        {/* text area */}
        <View style={styles.textAreaRow}>
          {showEdit ? (
            <TextInput
              style={[
                textStyle,
                styles.textArea,
                {
                  color: primaryColor,
                  borderColor: error ? "red" : primaryColor,
                },
              ]}
              value={value}
              onChangeText={onValueChange}
              autoFocus
              multiline
              numberOfLines={numberOfLines}
              placeholder={placeholder}
              placeholderTextColor={primaryColor}
              textAlignVertical="top"
            />
          ) : (
            <Text
              style={[
                textStyle,
                styles.valueText,
                { color: primaryColor },
                !value && styles.placeholderText,
              ]}
            >
              {value || placeholder}
            </Text>
          )}
        </View>

      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    marginRight: 12,
  },
  labelColumn: {
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    flexShrink: 1,
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
  textAreaRow: {
    width: "100%",
  },
  textArea: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    minHeight: 80,
  },
  valueText: {
    fontSize: 14,
    lineHeight: 20,
  },
  placeholderText: {
    opacity: 0.4,
  },
});

export default OptionTextAreaEdit;