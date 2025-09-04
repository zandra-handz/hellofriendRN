import React from "react";
import {
  StyleSheet,
  Pressable, 
  Text,
  Image,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native"; 

import GlobalPressable from "../appwide/button/GlobalPressable";

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
          //shapeSize
          width: 190,
          height: 190,
          // shapeHorPosition
          left: -48,
          // shapeVerPosition
          top: -23,
        }}
        resizeMode="contain"
      />
      <Text style={style.label}>
        {title}
      </Text>
    </GlobalPressable>
  );
};


const style = StyleSheet.create({
  button: {
      backgroundColor: "#ebebeb",
          borderRadius: 30,
    paddingVertical: "3%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",

  },
  label: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#121212",
  }



});

export default SignInButton;
