import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { StyleProps } from "react-native-reanimated";

type Props = {
  label: string;
  color: string;
  fontStyle: StyleProps;
  fontSize?: number; 
};

// the point of this component is to keep this plain header uniform across the app where it is used
const TextHeader = ({ label = `Header Label`, color, fontStyle, fontSize=26 }: Props) => {
  return (
    <View style={styles.wrapper}>
      <Text style={[fontStyle, { color: color, fontSize: fontSize}]}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    height: 40,
  },
});

export default TextHeader;
