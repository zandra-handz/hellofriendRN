import {  Text, ColorValue } from "react-native";
import React from "react";
 
type Props = {
  infoText: string;
  fontSize: number;
  lineHeight: number;
  primaryColor: ColorValue;
};

const ModalInfoText = ({
  infoText = "Info about this modal goes here",
  fontSize = 17,
  lineHeight = 22,
  primaryColor = 'orange',
}: Props) => { 
  return (
    <Text
      style={[
     
        {
          color: primaryColor,
          fontSize: fontSize,
          lineHeight: lineHeight,
          fontFamily: "Poppins-Regular",
      
        },
      ]}
    >
      {infoText}
    </Text>
  );
};

export default ModalInfoText;
