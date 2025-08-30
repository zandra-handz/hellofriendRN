import { Pressable } from "react-native";
import React from "react"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Colors {
  lightColor: string;
  homeDarkColor: string;
}

type Props = {
  manualGradientColors: Colors;
  onPress: () => void;
  iconName?: string;
};

const ActionAndBack = ({
  manualGradientColors,
  onPress,
  iconName = "check",
}: Props) => {
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
      <MaterialCommunityIcons
        name={`${iconName}`}
        size={25}
        color={manualGradientColors.homeDarkColor}
      />
    </Pressable>
  );
};

export default ActionAndBack;
