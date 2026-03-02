import { StyleSheet, View } from "react-native";
import React from "react";

type Props = {
  color: string;
  zIndex?: number;
};

const StaticBackdrop = ({ color, zIndex = 5 }: Props) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: color, zIndex: zIndex },
      ]}
    />
  );
};

export default StaticBackdrop;