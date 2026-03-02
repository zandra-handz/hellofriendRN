import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  labelColor: string;
  inputColor?: string;
  borderBottomColor?: string;
  style?: StyleProp<ViewStyle>;
  keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
  placeholder?: string;
  validate?: (value: string) => string | null;
};

const SingleFieldEdit: React.FC<Props> = ({
  label,
  value,
  onValueChange,
  labelColor,
  inputColor,
  borderBottomColor = "red",
  style,
  keyboardType = "default",
  placeholder = "None",
  validate,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const error = validate ? validate(value) : null;

  const handleConfirm = () => {
    if (error) return;
    setShowEdit(false);
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  return (
    <View style={[styles.outerContainer, style]}>
      <View style={styles.row}>
        <View style={styles.labelColumn}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          {showEdit && error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.valueColumn}>
          {showEdit ? (
            <TextInput
              style={[
                styles.input,
                {
                  color: inputColor ?? labelColor,
                  borderBottomColor: error ? "red" : borderBottomColor,
                },
              ]}
              value={value}
              onChangeText={onValueChange}
              autoFocus
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={labelColor}
            />
          ) : (
            <Text
              style={[
                styles.valueText,
                { color: labelColor },
                !value && styles.placeholderText,
              ]}
            >
              {value || placeholder}
            </Text>
          )}
        </View>

        <View style={styles.actionsColumn}>
          {!showEdit ? (
            <Pressable onPress={() => setShowEdit(true)}>
              <SvgIcon name="pencil" size={20} color={labelColor} />
            </Pressable>
          ) : (
            <>
              <Pressable onPress={handleCancel} style={styles.cancelButton}>
                <SvgIcon name="cancel" size={20} color={labelColor} />
              </Pressable>
              <Pressable onPress={handleConfirm} disabled={!!error}>
                <SvgIcon
                  name="check"
                  size={20}
                  color={error ? "gray" : labelColor}
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
  outerContainer: {
    width: "100%",
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  labelColumn: {
    width: 56,
    flexDirection: "column",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderText: {
    opacity: 0.4,
  },
  errorText: {
    fontSize: 9,
    color: "red",
    marginTop: 2,
    flexWrap: "wrap",
  },
  valueColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  valueText: {
    fontSize: 14,
  },
  input: {
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 10,
  },
});

export default SingleFieldEdit;
