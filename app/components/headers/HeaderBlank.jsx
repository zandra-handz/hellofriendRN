import React from "react";
import { StyleSheet } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { LinearGradient } from "expo-linear-gradient";

const HeaderBlank = () => {
  const { manualGradientColors } = useGlobalStyle();
  const { darkColor, lightColor } = manualGradientColors;

  return (
    <LinearGradient
      colors={[darkColor, darkColor]}
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer}
    ></LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    paddingTop: 66,
    paddingHorizontal: 10,
    height: 80, //110
    flexDirection: 'column',
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftButtonContainer: {
    width: 40, // Fixed width to keep it from moving
  },
  headerText: {
    position: "absolute",
    right: 60, // Maintain a fixed distance from the right icon
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
    width: "70%", // Adjust width to prevent overlapping
    textAlign: "right", // Keep the text aligned to the right
  },
  rightIconContainer: {
    width: 40,
    alignItems: "center",
  },
  defaultIconWrapper: {
    height: 44,
    width: 90,
    overflow: "hidden",
    justifyContent: "flex-end",
    paddingBottom: 6,
  },
  defaultIcon: {
    transform: [{ rotate: "240deg" }],
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeaderBlank;
