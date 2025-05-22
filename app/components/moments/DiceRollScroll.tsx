import React from "react";
import { View, Text } from "react-native";
import DiceRandom3dSolidSvg from "@/app/assets/svgs/dice-random-3d-solid.svg";

const DiceRollScroll = ({ size, color, onPress }) => {
  return (
    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
      <View style={{ height: 30, justifyContent: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: color }}>pick random </Text>
      </View>
      <DiceRandom3dSolidSvg
        height={size}
        width={size}
        color={color}
        onPress={onPress}
      />
    </View>
  );
};

export default DiceRollScroll;
