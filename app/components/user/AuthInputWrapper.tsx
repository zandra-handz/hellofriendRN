import { View, Text } from "react-native";
import Animated, { SlideInRight, SlideInDown } from "react-native-reanimated";
import React from "react";
import AuthInputHeader from "./AuthInputHeader";

type Props = {
  children: React.ReactNode;
  condition: string;
  label: string;
};

const AuthInputWrapper = ({
  children,
  condition,
  label,
  labelColor,
  labelSize,
  height = "auto",
  marginBottom = 0,
}) => {
  return (
    <Animated.View
      entering={SlideInRight.duration(100)}
      style={{
        flexDirection: "column",
        width: "100%",
        height: height,
        marginBottom: marginBottom,
      }}
    >
      <AuthInputHeader
        condition={condition}
        label={label}
        labelColor={labelColor}
        overrideFontSize={labelSize}
      />
      {children}
    </Animated.View>
  );
};


export default AuthInputWrapper;
