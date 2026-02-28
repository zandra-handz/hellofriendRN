import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

type Props = {
  label: string;
  color: string;
  borderColor: string;
  backgroundColor: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  pointerEvents?: "none" | "box-none" | "box-only" | "auto";
};

const CategoryTooltip = ({ label, color, borderColor, backgroundColor, containerStyle, labelStyle, pointerEvents = "none" }: Props) => {
  return (
    <View pointerEvents={pointerEvents} style={[styles.container, { borderColor, backgroundColor }, containerStyle]}>
      <Text style={[styles.label, { color }, labelStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },
  label: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});

export default CategoryTooltip;