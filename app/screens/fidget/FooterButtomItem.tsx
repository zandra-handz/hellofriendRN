// FooterButtonItem.tsx
import React from "react";
import { Text, Alert, StyleSheet } from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";

type FooterButtonItemProps = {
  iconName: string;
  label: string;
  onPress: () => void;
  color?: string;
  iconSize?: number;
  fontSize?: number;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
};

const FooterButtonItem = ({
  iconName,
  label,
  onPress,
  color = "#fff",
  iconSize = 24,
  fontSize = 11,
  confirmationRequired = false,
  confirmationTitle = "Just to be sure",
  confirmationMessage = "Are you sure?",
}: FooterButtonItemProps) => (
  <GlobalPressable
    onPress={() => {
      if (confirmationRequired) {
        Alert.alert(confirmationTitle, confirmationMessage, [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress },
        ]);
      } else {
        onPress();
      }
    }}
    style={styles.footerSection}
  >
    <SvgIcon name={iconName} size={iconSize} color={color} />
    <Text style={[styles.footerLabel, { color, fontSize }]}>{label}</Text>
  </GlobalPressable>
);

const styles = StyleSheet.create({
  footerSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  footerLabel: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default FooterButtonItem;