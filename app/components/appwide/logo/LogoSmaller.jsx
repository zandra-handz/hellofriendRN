import React from "react";
import { View, Text } from "react-native";

import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";

const LogoSmaller = () => {
  const svgSize = 130;

  const homeDarkColor = "#000002";

  const fontStyle = {
    fontFamily: "Poppins-Regular",
    fontSize: 26,
    lineHeight: 30,
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "auto",
      }}
    >
      <View style={{}}>
        <GeckoSolidSvg
          height={svgSize}
          width={svgSize}
          color={homeDarkColor}
          style={{ transform: [{ rotate: "190deg" }] }}
        />
      </View>
      <View style={{ paddingHorizontal: "10%", marginTop: "14%" }}>
        <Text style={[fontStyle, { textAlign: "center" }]}>
          Welcome to hellofriend!
        </Text>
      </View>
    </View>
  );
};

export default LogoSmaller;
