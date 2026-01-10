import React from "react";
import {
  StyleSheet, 
  View,
  Text,
  Image,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native";

import GlobalPressable from "../appwide/button/GlobalPressable";
import manualGradientColors from "@/app/styles/StaticColors";

type SignInButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  shapePositionValue?: number;
  shapePositionVerticalValue?: number;
};

const SignInButton: React.FC<SignInButtonProps> = ({
  onPress,
  title = "Sign in",
}) => {
  const coffeeCupHeartPng: ImageSourcePropType = require("@/app/assets/shapes/coffeecupdarkheart.png");

  // const shapeSize: number = 190;
  // const shapeHorPosition: number = -48;
  // const shapeVerPosition: number = -23;

  // need to make sure that pressable also works with accessibility stuff
  return (
    <GlobalPressable
      accessible={true}
      accessibilityLabel="Sign in button"
      accessibilityHint="Press to sign in or create an account"
      style={style.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        //doesn't need to be accessible, adds nothing apart from the visual
        source={coffeeCupHeartPng}
        style={{
          position: "absolute",

          width: 190,
          height: 190,
          left: -48,
          top: -23,
        }}
        resizeMode="contain"
      />
      <View
        style={style.containerToCenterLabel}
      >
        <Text style={[style.label, { color : manualGradientColors.homeDarkColor }]}>{title}</Text>
      </View>
    </GlobalPressable>
  );
};

const style = StyleSheet.create({
  button: {
    backgroundColor: "#ebebeb",
    height: 50,
    borderRadius: 30, 
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  containerToCenterLabel: {
    width: "100%", 
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Poppins-Bold",
    fontWeight: 'bold',
    fontSize: 16, 
  },
});

export default SignInButton;
