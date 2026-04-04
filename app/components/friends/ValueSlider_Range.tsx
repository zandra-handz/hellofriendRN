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
  range?: number;
  circular?: boolean;
  timeMode?: boolean;
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

const formatHour = (h: number): string => {
  const hour = ((h % 24) + 24) % 24;
  if (hour === 0) return "12a";
  if (hour === 12) return "12p";
  if (hour < 12) return `${hour}a`;
  return `${hour - 12}p`;
};

const ValueSlider_Range = ({
  label = "label",
  value = 2,
  step = 1,
  minValue = 1,
  maxValue = 5,
  range,
  circular = false,
  timeMode = false,
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
  const hasRange = typeof range === "number" && range > 0;
  const totalUnits = circular ? maxValue - minValue + 1 : maxValue - minValue;
  const sliderMax = hasRange && !circular ? Math.max(minValue, maxValue - range) : maxValue;
  const displayValue = invert ? invertValue(value, minValue, maxValue) : value;

  const spanStartPct = hasRange ? ((displayValue - minValue) / totalUnits) * 100 : 0;
  const spanWidthPct = hasRange ? ((range as number) / totalUnits) * 100 : 0;
  const spanOverflowPct = circular ? Math.max(0, spanStartPct + spanWidthPct - 100) : 0;
  const spanPrimaryWidthPct = spanWidthPct - spanOverflowPct;

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
          {hasRange && (
            <View pointerEvents="none" style={styles.spanTrack}>
              <View
                style={[
                  styles.spanFill,
                  {
                    backgroundColor: barColor,
                    left: `${spanStartPct}%`,
                    width: `${spanPrimaryWidthPct}%`,
                  },
                ]}
              />
              {spanOverflowPct > 0 && (
                <View
                  style={[
                    styles.spanFill,
                    {
                      backgroundColor: barColor,
                      left: `0%`,
                      width: `${spanOverflowPct}%`,
                    },
                  ]}
                />
              )}
            </View>
          )}
          <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={sliderMax}
            step={step}
            value={displayValue}
            onValueChange={handleValueChange}
            minimumTrackTintColor={hasRange ? "transparent" : barColor}
            maximumTrackTintColor={hasRange ? "transparent" : trackColor}
            thumbTintColor={pointColor}
          />
          {timeMode ? (
            <View style={styles.timeTickRow}>
              {(() => {
                const endHour = hasRange
                  ? ((displayValue + (range as number) - 1) % 24 + 24) % 24
                  : displayValue;
                const marks = [
                  { hour: 0, key: "12a" },
                  { hour: 12, key: "12p" },
                  { hour: displayValue, key: "start" },
                  { hour: endHour, key: "end" },
                ];
                return marks.map(({ hour, key }) => {
                  const pct = ((hour - minValue) / totalUnits) * 100;
                  return (
                    <Text
                      key={key}
                      style={[
                        styles.timeTickLabel,
                        { color: labelColor, left: `${pct}%` },
                      ]}
                    >
                      {formatHour(hour)}
                    </Text>
                  );
                });
              })()}
            </View>
          ) : (
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
          )}
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
  spanTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 14,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  spanFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 2,
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
  timeTickRow: {
    position: "relative",
    height: 14,
    marginTop: -4,
  },
  timeTickLabel: {
    position: "absolute",
    fontSize: 10,
    opacity: 0.7,
    transform: [{ translateX: -10 }],
  },
});

export default ValueSlider_Range;