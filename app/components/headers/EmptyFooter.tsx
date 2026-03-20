import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  backgroundColor?: string;
};

const EmptyFooter = ({ backgroundColor = "transparent" }: Props) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    borderRadius: 999,
    bottom: 0,
    zIndex: 0, 
    height: 90,
    paddingBottom: 12,
    opacity: 0.94,
  },
});

export default EmptyFooter;