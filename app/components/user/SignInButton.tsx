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

type SignInButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  label?: string;
  labelColor: string;
  backgroundColor: string;
};

const coffeeCupHeartPng: ImageSourcePropType = require("@/app/assets/shapes/coffeecupdarkheart.png");

const SignInButton: React.FC<SignInButtonProps> = ({
  onPress,
  label = "Sign in",
  labelColor = "red",
  backgroundColor = 'yellow'
}) => {
 
  return (
    <GlobalPressable
      accessible={true}
      accessibilityLabel="Sign in button"
      accessibilityHint="Press to sign in or create an account"
      style={[style.button, {backgroundColor: backgroundColor}]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        //doesn't need to be accessible, adds nothing apart from the visual
        source={coffeeCupHeartPng}
        style={style.imageContainer}
        resizeMode="contain"
      />
      <View style={style.containerToCenterLabel}>
        <Text style={[style.label, { color: labelColor }]}>{label}</Text>
      </View>
    </GlobalPressable>
  );
};

const style = StyleSheet.create({
  button: { 
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
    fontWeight: "bold",
    fontSize: 16,
  },
  imageContainer: {
    position: "absolute",
    width: 190,
    height: 190,
    left: -48,
    top: -23,
  },
});

export default SignInButton;
