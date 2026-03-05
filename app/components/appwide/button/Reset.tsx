import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import ButtonResetHelloes from "../../buttons/helloes/ButtonResetHelloes";
import OptionNoToggle from "../../headers/OptionNoToggle";  
interface Props {
  userId: number;
  label: string;
  icon?: React.ReactElement;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  buttonPadding?: number;
  onPressRow?: () => void;
}

const Reset: React.FC<Props> = ({
  userId,
  label,
  icon,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  onPressRow,
}) => {
  return (
    <OptionNoToggle
      label={label}
      icon={icon}
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      buttonColor={buttonColor}
      textStyle={textStyle}
      buttonPadding={buttonPadding}
      onPress={onPressRow}
      rightSlot={<ButtonResetHelloes userId={userId} />}
    />
  );
};

export default Reset;