import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import LizardSvg from "@/app/assets/svgs/lizard.svg";
import SafeView from "../format/SafeView";

const LogoSmaller = () => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  const svgSize = 130;

  //   const svgPositionRight = -10;
  //   const svgPositionTop = -10;

  const svgPositionRight = -10;
  const svgPositionTop = -240;

  const fontStyle = {
    //fontWeight: 'bold',
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
      {/* <View
        style={{
          position: "absolute",
          opacity: 0.3,
          right: svgPositionRight,
          top: svgPositionTop,
        }}
      > */}
        {/* <GeckoSolidSvg
          height={400}
          width={400}
          color={themeStyles.genericTextBackground.backgroundColor}
          style={{ transform: [{ rotate: "200deg" }] }}
        /> */}

        {/* <LizardSvg
              height={400}
              width={400}
              color={themeStyles.genericTextBackground.backgroundColor}
               style={{transform: [{rotate: '260deg'}]}}
            /> */}
      {/* </View> */}

      <View style={{}}>
        <GeckoSolidSvg
          height={svgSize}
          width={svgSize}
          color={themeStyles.genericTextBackground.backgroundColor}
          style={{ transform: [{ rotate: "190deg" }] }}
        />
        {/* <LizardSvg
              height={svgSize}
              width={svgSize}
              color={themeStyles.genericTextBackground.backgroundColor}
               style={{transform: [{rotate: '260deg'}]}}
            /> */}
      </View>
      <View style={  { paddingHorizontal: "10%", marginTop: "14%" }}>
        <Text
          style={[
            fontStyle, 
            themeStyles.genericTextBackground.backgroundColor, {textAlign: 'center'}
          ]}
        >
          Welcome to hellofriend!
        </Text>
      </View>
    </View> 
  );
};
 

export default LogoSmaller;
