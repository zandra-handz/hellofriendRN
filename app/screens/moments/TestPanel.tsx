import { View, Text, StyleSheet } from "react-native";
import React from "react";


type Props = {
  values: Record<string, string | number | boolean | null | undefined>;
};

const TestPanel = ({ values }: Props) => {
  return (
    <View
      style={styles.container}
    >
      {Object.entries(values).map(([label, value]) => (
        <Text key={label} style={{ color: "white", fontSize: 10 }}>
          {label}: {String(value)}
        </Text>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {      backgroundColor: "red",
        position: "absolute",
        top: 50,
        padding: 6,
        zIndex: 9999,},
  innerContainer: {flexDirection: 'column'},
  rowContainer: {flexDirection: 'row'},
  labelWrapper: {},
  label: {},
});


export default TestPanel;
