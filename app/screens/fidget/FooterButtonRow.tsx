// FooterButtonRow.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
 
import FooterButtonItem from "./FooterButtomItem";

type ButtonConfig = {
  iconName: string;
  label: string;
  onPress: () => void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
};

type FooterButtonRowProps = {
  buttons: ButtonConfig[];
  backgroundColor?: string;
  color?: string;
  iconSize?: number;
  fontSize?: number;
  height?: number;
  paddingBottom?: number;
  style?: ViewStyle;
};

const FooterButtonRow = ({
  buttons,
  backgroundColor = "rgba(0,0,0,0.3)",
  color = "#fff",
  iconSize = 24,
  fontSize = 11,
  height = 90,
  paddingBottom = 12,
  style,
}: FooterButtonRowProps) => (
  <View
    style={[
      styles.container,
      { backgroundColor, height, paddingBottom },
      style,
    ]}
  >
    {buttons.map((btn, index) => (
      <FooterButtonItem
        key={`${btn.iconName}-${index}`}
        iconName={btn.iconName}
        label={btn.label}
        onPress={btn.onPress}
        color={color}
        iconSize={iconSize}
        fontSize={fontSize}
        confirmationRequired={btn.confirmationRequired}
        confirmationTitle={btn.confirmationTitle}
        confirmationMessage={btn.confirmationMessage}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default FooterButtonRow;