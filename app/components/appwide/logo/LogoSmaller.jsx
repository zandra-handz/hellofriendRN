import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";

const LogoSmaller = () => {
  // const svgSize = 130;
  // const homeDarkColor = "#000002";

  return (
    <View style={styles.container}>
      <View>
        {/* <GeckoSolidSvg
          height={130}
          width={130}
          color={"#000002"}
          style={styles.rotateGecko}
        /> */}
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Welcome to Hellofriend App!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // height: "auto",
  },
  rotateGecko: {
    transform: [{ rotate: "190deg" }],
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 28,
    lineHeight: 30,
    textAlign: "center",
    fontWeight: 'bold'
  },
  labelContainer: {
    paddingHorizontal: 6,
    width: "100%",
    marginTop: 40,
  },
});

export default LogoSmaller;
