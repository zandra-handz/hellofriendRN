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

  const welcomeText = AppFontStyles.logoText;
  return (

  
    <View style={styles.container}>
      <View></View>
      <View style={styles.labelContainer}>
        <Text style={[ welcomeText,styles.label, { color: labelColor }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }, 
  label: {  
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
   // fontWeight: "bold",
  },
  labelContainer: {
    paddingHorizontal: 6,
    width: "100%",
    marginTop: 40,
  },
});

export default AppTitle;
