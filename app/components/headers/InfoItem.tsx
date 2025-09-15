import { View, Text } from "react-native";
import React from "react";
import ModalInfoText from "./ModalInfoText";

type Props = {
  infoText: string;
  fontSize: number;
  lineHeight: number;
  primaryColor: string;
};

const InfoItem = ({
  infoText = "text here",
  fontSize = 17,
  lineHeight = 22,
  primaryColor,
}: Props) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
  
      }}
    >
      <ModalInfoText
        infoText={infoText}
        fontSize={fontSize}
        lineHeight={lineHeight}
        primaryColor={primaryColor}
      />
    </View>
  );
};

export default InfoItem;
