import React from "react";
import { View, StyleSheet } from "react-native";

const BelowHeaderContainer = ({
  height = 30,
  paddingHorizontal = "4%",
  alignItems = "center",
  marginBottom = "2%",
  justifyContent = "flex-end",
  children,
  zIndex = 3000,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          height: height,
          minHeight: height, //not sure what is using this, set to height for now
          maxHeight: height, //not sure what is using this, set to height for now
          paddingHorizontal: paddingHorizontal,
          justifyContent: justifyContent,
          alignItems: alignItems,
          marginBottom: marginBottom,
          zIndex: zIndex,
        },
      ]}
    >
      {children && children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
  },
});

export default BelowHeaderContainer;
