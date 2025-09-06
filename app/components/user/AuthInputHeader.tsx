import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut} from "react-native-reanimated";
import { appFontStyles } from "@/src/hooks/StaticFonts";
// import { BaseAnimationBuilder } from "react-native-reanimated";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react"; 
type Props = {
//   enteringStyle?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
//   exitingStyle?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
//   fontStyle: object;
//   height: number;
  condition: string;
  label: string;
};

const AuthInputHeader = ({
//   enteringStyle,
//   exitingStyle,
//   fontStyle,
//   height,
  condition,
  label,
}: Props) => {


 const ENTERING_ANIMATION = FadeIn.delay(200);
 const EXITING_ANIMATION = FadeOut;

   const HEIGHT = appFontStyles.subWelcomeText.lineHeight;
   const FONT_STYLE = [
     appFontStyles.subWelcomeText,
     {
        fontSize: 10,
       fontWeight: "bold",
     },
   ];



 const PADDING_LEFT = 4;

  return (
    <View style={[styles.container, { height: HEIGHT, paddingLeft: PADDING_LEFT }]}>
      {condition && (
        <Animated.View
          entering={ENTERING_ANIMATION}
          exiting={EXITING_ANIMATION}
          style={{ flexDirection: "row" }}
        >
          <Text style={FONT_STYLE}>{label}</Text>
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
