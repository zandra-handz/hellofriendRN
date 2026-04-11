import React, { useState } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import {
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

type EnergyState = {
  energy: number;
  surplusEnergy: number;
} | null;

type Props = {
  energySV: SharedValue<EnergyState>;
  color?: string;
  style?: TextStyle;
};

const EnergyText = ({
  energySV,
  color = "white",
  style,
}: Props) => {
  const [label, setLabel] = useState("energy: —");

  useAnimatedReaction(
    () => {
      const current = energySV.value;

      if (!current) {
        return "energy: —";
      }

      const e = current.energy ?? 0;
      const s = current.surplusEnergy ?? 0;

      return `energy: ${e.toFixed(2)} | surplus: ${s.toFixed(2)}`;
    },
    (next, prev) => {
      if (next !== prev) {
        runOnJS(setLabel)(next);
      }
    },
    [energySV],
  );

  return <Text style={[styles.text, { color }, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
});

export default EnergyText;