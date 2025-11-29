import { Pressable, StyleSheet } from "react-native";
import React from "react";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  onPress: () => void;
};

const ToNextButton = ({ onPress }: Props) => {
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: manualGradientColors.lightColor,
        },
      ]}
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

const styles = StyleSheet.create({
  container: {
    width: "auto",
    height: 38,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  }, 
});

export default ToNextButton;
