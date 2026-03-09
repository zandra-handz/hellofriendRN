import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";

type Props = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  labelColor: string;
  barColor: string;
  pointColor: string;
  trackColor: string;
  step?: number;
  minValue?: number;
  maxValue?: number;
  invert?: boolean;
  valueLabels?: string[];
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
};

const invertValue = (value: number, min: number, max: number): number => {
  return min + max - value;
};

const getStepCount = (min: number, max: number, step: number): number => {
  return Math.floor((max - min) / step) + 1;
};

const ValueSlider = ({
  label = "label",
  value = 2,
  step = 1,
  minValue = 1,
  maxValue = 5,
  onValueChange,
  labelColor = "red",
  barColor = "orange",
  pointColor = "yellow",
  trackColor = "hotpink",
  invert = false,
  valueLabels,
  style,
  textStyle,
}: Props) => {
  const displayValue = invert ? invertValue(value, minValue, maxValue) : value;

  const handleValueChange = (sliderValue: number) => {
    const outputValue = invert
      ? invertValue(sliderValue, minValue, maxValue)
      : sliderValue;
    onValueChange(outputValue);
  };

  const stepCount = getStepCount(minValue, maxValue, step);
  const steps = Array.from({ length: stepCount }, (_, i) => minValue + i * step);
  const displaySteps = invert ? [...steps].reverse() : steps;

  const hasValidLabels = valueLabels && valueLabels.length === stepCount;
  const activeLabel = hasValidLabels
    ? valueLabels[Math.round(displayValue) - minValue]
    : null;

  return (
    <View style={[styles.outerContainer, style]}>
      <View style={styles.row}>
        <View style={styles.labelColumn}>
          <Text style={[styles.label, textStyle, { color: labelColor }]}>{label}</Text>
          {activeLabel && (
            <Text style={[styles.activeLabel, { color: labelColor }]}>
              {activeLabel}
            </Text>
          )}
        </View>

        <View style={styles.sliderColumn}>
          <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={step}
            value={displayValue}
            onValueChange={handleValueChange}
            minimumTrackTintColor={barColor}
            maximumTrackTintColor={trackColor}
            thumbTintColor={pointColor}
          />
          <View style={styles.tickRow}>
            {displaySteps.map((s) => (
              <Text
                key={s}
                style={[
                  styles.tickLabel,
                  { color: labelColor },
                  s === displayValue && styles.tickLabelActive,
                ]}
              >
                {s}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    paddingHorizontal: 0, 
    paddingBottom: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelColumn: {
    width: 56,
    flexDirection: "column",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  sliderColumn: {
    flex: 1,
    flexDirection: "column",
  },
  slider: {
    width: "100%",
    height: 30,
  },
  tickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: -4,
  },
  tickLabel: {
    fontSize: 10,
    opacity: 0.4,
    textAlign: "center",
  },
  tickLabelActive: {
    opacity: 1,
    fontWeight: "bold",
  },
});

export default ValueSlider;