import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

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
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const coffeeCupHeartPng: ImageSourcePropType = require("@/app/assets/shapes/coffeecupdarkheart.png");
   
  // const shapeSize: number = 190;
  // const shapeHorPosition: number = -48;
  // const shapeVerPosition: number = -23;

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel="Sign in button"
      accessibilityHint="Press to sign in or create an account"
      style={[
        appContainerStyles.signInButtonContainer,
        themeStyles.signInButton,
      ]}
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
      <Text style={[appFontStyles.signInButtonLabel, themeStyles.primaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SignInButton;
