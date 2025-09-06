import { View, Text, Pressable, StyleSheet } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { manualGradientColors } from "@/src/hooks/StaticColors";

type Props = {
  label: string;
};

const AuthScreenHeader = ({ label }: Props) => {
  return (
    <Text
      style={{
        color: manualGradientColors.darkHomeColor,
        fontFamily: "Poppins-Bold",
        fontSize: 16,
        selfAlign: "center",
      }}
      accessible={true}
    >
      {label}
    </Text>
  );
};

export default AuthScreenHeader;
