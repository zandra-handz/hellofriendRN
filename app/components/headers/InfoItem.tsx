import { View, StyleSheet, ColorValue } from "react-native";
import React from "react";
import ModalInfoText from "./ModalInfoText";

type Props = {
  infoText: string;
  fontSize?: number;
  lineHeight?: number;
  primaryColor: ColorValue;
};

const InfoItem = ({
  infoText = "text here",
  fontSize = 17,
  lineHeight = 22,
  primaryColor,
}: Props) => {
  return (
    <View
      style={styles.container}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
});

export default InfoItem;
