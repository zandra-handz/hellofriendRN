import { View, Text } from "react-native";
import React from "react";
import ModalInfoText from "./ModalInfoText";

type Props = {
  infoText: string;
};

const InfoItem = ({ infoText = "text here" }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <ModalInfoText infoText={infoText} />
    </View>
  );
};

export default InfoItem;
