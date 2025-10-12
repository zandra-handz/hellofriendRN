import { Pressable } from "react-native";
import React from "react";
import manualGradientColors  from "@/app/styles/StaticColors"; 
import SvgIcon from "@/app/styles/SvgIcons";

interface Colors {
  lightColor: string;
  homeDarkColor: string;
}

type Props = { 
  onPress: () => void;
};

const ToNextButton = ({   onPress }: Props) => {
  return (
    <Pressable
      style={{
        width: "auto",
        height: 38,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,

        backgroundColor: manualGradientColors.lightColor,
      }}
      onPress={onPress}
    >
      <SvgIcon
        name={"arrow_right"}
        size={25}
        color={manualGradientColors.homeDarkColor}
      />
    </Pressable>
  );
};

export default ToNextButton;
