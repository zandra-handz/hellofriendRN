import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

type Props = {
  infoText: string;
};

const ModalInfoText = ({
  infoText = "Info about this modal goes here",
}: Props) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  return (
    <Text
      style={[
        themeStyles.primaryText,
        {
          fontSize: 17,
          lineHeight: 22,
          fontFamily: "Poppins-Regular",
      
        },
      ]}
    >
      {infoText}
    </Text>
  );
};

export default ModalInfoText;
