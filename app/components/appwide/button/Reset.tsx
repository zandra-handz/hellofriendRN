import React from "react";
import { Alert } from "react-native";
import ButtonResetHelloes from "../../buttons/helloes/ButtonResetHelloes";
import OptionNoToggle from "../../headers/OptionNoToggle";

import { useRemixUpcomingHelloes } from "@/src/hooks/useRemixUpcomingHelloes";
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
}) => {
  const { handleRemixAllNextHelloes } = useRemixUpcomingHelloes({ userId });

  const handleOnPress = () => {
    Alert.alert(
      "Warning!",
      "Reset all suggested hello dates? (You can run this reset three times a day.)",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => handleRemixAllNextHelloes() },
      ],
    );
  };

  const LABEL = `Reset all hello dates`;
  const ICON = `refresh`;
  const ICON_SIZE = 20;

  return (
    <OptionNoToggle
      label={LABEL}
      iconName={ICON}
      iconSize={ICON_SIZE}
      iconColor={primaryColor}
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      buttonColor={buttonColor}
      textStyle={textStyle}
      buttonPadding={buttonPadding}
      onPress={handleOnPress} 
    />
  );
};

export default Reset;
