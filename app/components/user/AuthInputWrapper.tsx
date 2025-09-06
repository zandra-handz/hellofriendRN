import { View, Text } from "react-native";
import Animated, { SlideInRight, SlideInDown } from "react-native-reanimated";
import React from "react";
import AuthInputHeader from "./AuthInputHeader";

type Props = {
  children: React.ReactNode;
  condition: string;
  label: string;
};

const AuthInputWrapper = ({ children, condition, label }: Props) => {
  return (
    <Animated.View
      entering={SlideInRight.duration(100)}
      style={{
        flexDirection: "column",
        width: "100%",
        // backgroundColor: "pink",
      }}
    >
      <Animated.View entering={SlideInDown}>
        <AuthInputHeader condition={condition} label={label} />
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default AuthInputWrapper;
