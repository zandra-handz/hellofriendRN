import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";
const MomentPulseBobReceiver = ({
  animatedCardsStyle,
  index,
  children,
  width = "94%",
}) => {
  const {
    themeStyles,
    appAnimationStyles,
    appContainerStyles,
    appSpacingStyles,
    manualGradientColors,
  } = useGlobalStyle();
  const isEven = index % 2 === 0 ? -1 : 1;

  return (
    <>
      <Animated.View
        style={[
          appAnimationStyles.flashAnimMomentsContainer,
          appSpacingStyles.momentsScreenPrimarySpacing,
          animatedCardsStyle,
          {
            width: width,
            borderColor: themeStyles.genericTextBackground.backgroundColor, // manualGradientColors.homeDarkColor,
            borderWidth: 2,
          },
        ]}
      >
        <View
          style={[
            {
              position: "absolute",
              top: 110,
              right: '24%',
              left: '24%',
              height: 100,
              zIndex: 2000,
              transform: [{ scaleX: index % 2 === 0 ? -1 : 1 }],
            },
          ]}
        >
          <GeckoSvg
            height={380}
            width={380}
            color={themeStyles.genericTextBackground.backgroundColor}
            color={'red'}
            style={appContainerStyles.bigGeckoRotate}
          />
        </View>
        <Animated.Text>{children}</Animated.Text>
      </Animated.View>
    </>
  );
};

export default MomentPulseBobReceiver;
