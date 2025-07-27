import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import LizardSvg from "@/app/assets/svgs/lizard.svg";
import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";

const LargeCornerLizard = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyle();
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
      color={themeStyles.darkerOverlayBackgroundColor.backgroundColor}
      style={appContainerStyles.bigGeckoRotate}
    />
  );
};

export default LargeCornerLizard;
