import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";

type Props = {
  label: string;
  labelColor: string;
};

const AppTitle = ({
  label = "Welcome to the FriendKeeper App!",
  labelColor,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text
        style={[AppFontStyles.logoText, styles.label, { color: labelColor }]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", 
    paddingHorizontal: 6,
    width: "100%",
  },
  label: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    // fontWeight: "bold",
  }, 
});

export default AppTitle;
