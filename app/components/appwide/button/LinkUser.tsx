import React from "react";
import { TextStyle } from "react-native";
import OptionNoToggle from "../../headers/OptionNoToggle";

interface Props {
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  buttonPadding?: number;
  viewCode: boolean;
  toggleViewCode: () => void;
  linkedUser: string | null;
}

const LinkUser: React.FC<Props> = ({
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  viewCode,
  toggleViewCode,
  linkedUser,
}) => {
  const isLinked = !!linkedUser;
  const LABEL = isLinked ? `Linked to ${linkedUser}` : "Link a user";
  const ICON = isLinked ? "lock_outlne" : viewCode ? "chevron_down" : "chevron_right";
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
      onPress={isLinked ? undefined : toggleViewCode}
    />
  );
};

export default LinkUser;
