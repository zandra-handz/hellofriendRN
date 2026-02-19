import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  labelColor: string;
};
 
const AppTitle = ({
  label = "Welcome to Hellofriend App!",
  labelColor,
}: Props) => {
  return (
    <View style={styles.container}>
      <View></View>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
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
    fontFamily: "Poppins-Regular",
    fontSize: 28,
    lineHeight: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  labelContainer: {
    paddingHorizontal: 6,
    width: "100%",
    marginTop: 40,
  },
});

export default AppTitle;
