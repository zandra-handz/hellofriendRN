import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
// import { BaseAnimationBuilder } from "react-native-reanimated";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";
import manualGradientColors  from "@/src/hooks/StaticColors";
type Props = {
  //   enteringStyle?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
  //   exitingStyle?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
  //   fontStyle: object;
  //   height: number;
  condition: string;
  label: string;
  labelColor?: string;
};

const AuthInputHeader = ({
  //   enteringStyle,
  //   exitingStyle,
  //   fontStyle,
  //   height,
  condition,
  label,
  labelColor,
  overrideFontSize,
}: Props) => {
  const ENTERING_ANIMATION = FadeIn.delay(200);
  const EXITING_ANIMATION = FadeOut;

  const HEIGHT = AppFontStyles.subWelcomeText.lineHeight;
  const FONT_STYLE = [
    AppFontStyles.subWelcomeText,
    {
      fontSize: overrideFontSize || 10,
      fontWeight: "bold",
    },
  ];

  const PADDING_LEFT = 4;

  return (
    <View
      style={[styles.container, { height: HEIGHT, paddingLeft: PADDING_LEFT }]}
    >
      {condition && (
        <Animated.View
          entering={ENTERING_ANIMATION}
          exiting={EXITING_ANIMATION}
          style={{ flexDirection: "row" }}
        >
          <Text
            style={[
              FONT_STYLE,
              {
                color: labelColor
                  ? labelColor
                  : manualGradientColors.homeDarkColor,
              },
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
});

export default AuthInputHeader;
