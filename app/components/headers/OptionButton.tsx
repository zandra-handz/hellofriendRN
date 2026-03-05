import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  onPress: () => void;
  label: string;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  buttonPadding?: number;
  onLongPress?: () => void;
  onPressOut?: () => void;
};

const OptionButton = ({
  onPress,
  label,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  onLongPress,
  onPressOut,
}: Props) => {
  return (
    <GlobalPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      style={[
        styles.button,
        {
          padding: buttonPadding,
          backgroundColor: buttonColor,
        },
      ]}
    >
      <Text
        style={[
          textStyle,
          styles.text,
          {
            color: primaryColor,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {label}
      </Text>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    height: "auto",
    borderRadius: 10,
  },
  text: {
    borderRadius: 6,
    padding: 10,
  },
});

export default OptionButton;