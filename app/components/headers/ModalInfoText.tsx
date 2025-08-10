import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

type Props = {
  infoText: string;
  fontSize: number;
  lineHeight: number;
};

const ModalInfoText = ({
  infoText = "Info about this modal goes here",
  fontSize = 17,
  lineHeight = 22,
}: Props) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  return (
    <Text
      style={[
        themeStyles.primaryText,
        {
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
