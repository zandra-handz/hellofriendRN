import { View, Text, Pressable } from "react-native";
import React from "react";

type Props = {
  onPress: () => void;
  bottom?: number;
  left?: number;
  color?: string;
};

const DebugButton = ({ onPress, bottom=120, left=20, color="orange" }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 50,
        height: 50,
        position: "absolute",
        bottom: bottom,
        left: left,
        backgroundColor: color,
        borderRadius: 999,
      }}
    ></Pressable>
  );
};

export default DebugButton;
