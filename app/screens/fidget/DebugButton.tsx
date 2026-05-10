import { View, Text, Pressable } from "react-native";
import React from "react";

type Props = {
  onPress: () => void;
  bottom?: number;
  left?: number;
  color?: string;
  zIndex?: number;
};

const DebugButton = ({ onPress, bottom=120, left=20, color="orange", zIndex=10000 }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        zIndex: zIndex,
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
