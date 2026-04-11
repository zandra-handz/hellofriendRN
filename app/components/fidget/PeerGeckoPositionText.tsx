import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

type PeerGeckoPosition = {
  from_user: number;
  position: [number, number];
  received_at: number;
} | null;

type Props = {
  peerGeckoPositionSV: SharedValue<PeerGeckoPosition>;
  color?: string;
  style?: TextStyle;
};

const PeerGeckoPositionText = ({
  peerGeckoPositionSV,
  color = "white",
  style,
}: Props) => {
  const [label, setLabel] = useState("peer: —");

  useAnimatedReaction(
    () => {
      const current = peerGeckoPositionSV.value;

      if (!current) {
        return "peer: —";
      }

      const [x, y] = current.position ?? [0, 0];
      return `peer ${current.from_user}: ${x.toFixed(1)}, ${y.toFixed(1)}`;
    },
    (next, prev) => {
      if (next !== prev) {
        runOnJS(setLabel)(next);
      }
    },
    [peerGeckoPositionSV],
  );

  return <Text style={[styles.text, { color }, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
});

export default PeerGeckoPositionText;