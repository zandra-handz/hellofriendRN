import { Pressable, StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import manualGradientColors from "@/app/styles/StaticColors";
interface Colors {
  lightColor: string;
  homeDarkColor: string;
}

type Props = {
  onPress: () => void;
  iconName?: string; 
  rounded: boolean;
};

const ActionAndBack = ({ onPress, iconName = "check", rounded=false }: Props) => {
  return (
    <Pressable
      style={[ styles.container, { 
        backgroundColor: manualGradientColors.lightColor,
        borderRadius: rounded? 999 : 5, // remove conditional check if we can make all of them rounded
      }]}
      onPress={onPress}
    >
      <SvgIcon
        name={`${iconName}`}
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
    borderRadius: 5,
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default ActionAndBack;
