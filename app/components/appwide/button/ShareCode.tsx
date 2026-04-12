import React, { useState } from "react"; 
import OptionNoToggle from "../../headers/OptionNoToggle"; 
interface Props {
  userId: number;
  label: string;
  icon?: React.ReactElement;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  viewCode: boolean;
  buttonPadding?: number;
 toggleViewCode: () => void;
}

const ShareCode: React.FC<Props> = ({
  userId, 
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4, 
  viewCode,
  toggleViewCode,
}) => { 

 

  const LABEL = `Share account code`;
  const ICON =  viewCode ? `chevron_down` : `chevron_right`;
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
      onPress={toggleViewCode} 
    />
  );
};

export default ShareCode;
