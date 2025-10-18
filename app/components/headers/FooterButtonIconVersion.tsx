import { Text, StyleSheet, Alert, ColorValue } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";

interface ButtonDeselectProps {
  label: string;
  icon: React.ReactElement;
  primaryColor: ColorValue;
  labelFontSize?: number;
  onPress: () => void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  confirmationActionWord?: string;
}

const FooterButtonIconVersion: React.FC<ButtonDeselectProps> = ({
  label = "",
  primaryColor,
  icon,
  labelFontSize = 11,
  onPress,
  confirmationRequired = false,
  confirmationTitle = "",
  confirmationMessage = "Are you sure?",
  confirmationActionWord = "Yes",
}) => {
  const handleOnPress = () => {
    if (confirmationRequired) {
      Alert.alert(confirmationTitle, confirmationMessage, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: confirmationActionWord, onPress: () => onPress() },
      ]);
    } else {
      onPress();
    }
  };

  return (
    <GlobalPressable onPress={() => handleOnPress()} style={styles.container}>
      {icon && icon}
      <Text
        style={[
          styles.text,
          {
            fontSize: labelFontSize,

            color: primaryColor,
          },
        ]}
      >
        {label}
      </Text>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1,
  },
  text: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default FooterButtonIconVersion;
