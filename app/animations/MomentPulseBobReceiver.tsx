import React from "react"; 
import Animated from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const MomentPulseBobReceiver = ({
  animatedCardsStyle,

  children,
  width = "94%",
}) => {
  const { themeStyles, appAnimationStyles, appSpacingStyles, manualGradientColors } = useGlobalStyle();

   

  return (
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
      <Animated.Text>{children}</Animated.Text>
    </Animated.View>
  );
};

export default MomentPulseBobReceiver;
