import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React, { useState } from "react";
import Slider from "@react-native-community/slider";

type Props = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  labelColor: string;
  barColor: string;
  pointColor: string;
  trackColor: string;
  style?: StyleProp<ViewStyle>;
};

const FiveValueSlider = ({
  label = "label",
  value = 2,
  onValueChange,
  labelColor = "red",
  barColor = "orange",
  pointColor = "yellow",
  trackColor = "hotpink",
  style
}: Props) => {
  return (
    <View style={[styles.container, style]}>

      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
 
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={barColor}
        maximumTrackTintColor={trackColor}
        thumbTintColor={pointColor}
      />
     <Text style={[styles.valueText, { color: labelColor }]}>{value}</Text>
 
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
   // backgroundColor: 'teal',
    height: 44,
  },
  label: {
    width: 56,
    fontSize: 14,
    fontWeight: '600',
    // marginBottom: 8,
  },
  slider: {
    width: '70%',
    height: 30,
  },
  valueText: {
    maxWidth:20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginTop: 4,
  },
});

export default FiveValueSlider;