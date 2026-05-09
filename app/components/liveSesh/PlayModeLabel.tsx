import { View, Text, StyleSheet } from "react-native";
import React from "react";

type Props = {
  label?: string;
  labelColor?: string;
};

const PlayModeLabel = ({ label, labelColor = "#ffffff" }: Props) => {
  return (
    <View pointerEvents="none" style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default PlayModeLabel;
