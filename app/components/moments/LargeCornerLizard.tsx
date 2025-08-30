import React from "react";
import { StyleSheet } from 'react-native'; 
 
import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";

const LargeCornerLizard = ({color}) => { 
  return (
    //   <LizardSvg
    //     height={300}
    //     width={300}
    //     color={themeStyles.genericTextBackground.backgroundColor}
    //     style={appContainerStyles.bigLizardRotate}
    //   />

    <GeckoSvg
      height={300}
      width={300}
      color={color}
      style={styles.bigGeckoRotate}
    />
  );
};

const styles = StyleSheet.create({
    bigGeckoRotate: {
    zIndex: 50000,
    elevation: 50000,
    position: "absolute",
    zIndex: 0,
    bottom: -90,
    left: -90,
    transform: [
      { rotate: "-0deg" },
      // Flip horizontally (mirror image)
    ],
    opacity: 1,
  },

});

export default LargeCornerLizard;
