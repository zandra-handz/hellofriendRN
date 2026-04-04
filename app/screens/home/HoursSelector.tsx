import { View, Text, StyleSheet, Pressable, Alert, TextStyle } from 'react-native'
import React, { useState } from 'react'
import ValueSlider_Range from '@/app/components/friends/ValueSlider_Range'
import RandomHoursGrid from '@/app/components/friends/RandomHoursGrid'
import SvgIcon from "@/app/styles/SvgIcons";

// hourType values must match backend ActivityHours choices:
// day=1, night=2, random=3
const DAY = 1;
const NIGHT = 2;
const RANDOM = 3;

type Props = {
    hourType: number;
    activeHours?: number[];
    maxHours?: number;
    onSave: (hours: number[], newHourType: number) => void;
    primaryColor?: string;
    backgroundColor?: string;
    buttonColor?: string;
    textStyle?: TextStyle;
}


const buildHours = (start: number, length: number): number[] =>
  Array.from({ length }, (_, i) => (start + i) % 24);

// Mirrors backend GeckoConfigsSerializer day/night classification:
// center of the contiguous block; closer to 12 = day, closer to 0 = night.
const circularDistance = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 24;
  return Math.min(d, 24 - d);
};

// Backend sorts active_hours, so a wrap-around block like [18..23, 0..5] arrives
// as [0..5, 18..23]. Find the real start by locating the largest gap between
// consecutive hours (with wrap); the block starts right after that gap.
const findBlockStart = (sortedHours: number[]): number => {
  if (sortedHours.length === 0) return 0;
  if (sortedHours.length === 1) return sortedHours[0];
  let biggestGap = -1;
  let startIndex = 0;
  for (let i = 0; i < sortedHours.length; i++) {
    const curr = sortedHours[i];
    const next = sortedHours[(i + 1) % sortedHours.length];
    const gap = ((next - curr - 1) + 24) % 24;
    if (gap > biggestGap) {
      biggestGap = gap;
      startIndex = (i + 1) % sortedHours.length;
    }
  }
  return sortedHours[startIndex];
};

const classifyBlock = (start: number, length: number): "day" | "night" | null => {
  if (length <= 0) return null;
  const center = (start + (length - 1) / 2) % 24;
  const dNoon = circularDistance(center, 12);
  const dMidnight = circularDistance(center, 0);
  if (dNoon === dMidnight) return null;
  return dNoon < dMidnight ? "day" : "night";
};

const HoursSelector = ({
  hourType,
  activeHours = [],
  maxHours = 16,
  onSave,
  primaryColor = 'red',
  backgroundColor = 'transparent',
  buttonColor = 'transparent',
  textStyle,
}: Props) => {

    // console.log(`hourselector active hours: `, activeHours)
  const span = activeHours.length || maxHours;
  const [startHour, setStartHour] = useState<number>(activeHours[0] ?? 0);
  const [randomHours, setRandomHours] = useState<number[]>(
    activeHours.length === maxHours ? [...activeHours].sort((a, b) => a - b) : [],
  );

  const classification = classifyBlock(startHour, span);
  const classifiedType =
    classification === "day" ? DAY : classification === "night" ? NIGHT : hourType;

  const handleValueChange = (v: number) => {
    setStartHour(v);
  };

  const commitSave = () => {
    if (hourType === RANDOM) {
      onSave(randomHours, RANDOM);
    } else {
      onSave(buildHours(startHour, span), classifiedType);
    }
  };

  const handleConfirm = () => {
    if (hourType === RANDOM) {
      commitSave();
      return;
    }
    if (classifiedType !== hourType) {
      const nextLabel = classifiedType === DAY ? "Day" : "Night";
      const prevLabel = hourType === DAY ? "Day" : "Night";
      Alert.alert(
        "Change mode?",
        `These hours are centered closer to ${nextLabel.toLowerCase()}. This will switch the mode from ${prevLabel} to ${nextLabel}.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: commitSave },
        ],
      );
      return;
    }
    commitSave();
  };

  return (
    <View style={[styles.button, { backgroundColor: buttonColor }]}>
      <View style={[styles.inner, { backgroundColor }]}>
        <View style={styles.sliderWrap}>
          {hourType < RANDOM && classification && (
            <Text style={[styles.classification, { color: primaryColor }]}>
              {classification === "day" ? "Day" : "Night"}
            </Text>
          )}
          {hourType < RANDOM && (
            <ValueSlider_Range
              label=""
              minValue={0}
              maxValue={23}
              range={span}
              circular
              timeMode
              step={1}
              value={startHour}
              barColor={primaryColor}
              labelColor={primaryColor}
              trackColor={primaryColor}
              pointColor={'limegreen'}
              onValueChange={handleValueChange}
            />
          )}
          {hourType === RANDOM && (
            <RandomHoursGrid
              value={randomHours}
              maxHours={maxHours}
              color={primaryColor}
              textStyle={textStyle}
              onChange={setRandomHours}
            />
          )}
        </View>

        <View style={styles.actionsColumn}>
          <Pressable onPress={handleConfirm}>
            <SvgIcon name="check" size={18} color={primaryColor} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
    padding: 4,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  classification: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    opacity: 0.8,
  },
  sliderWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 28,
    justifyContent: "flex-end",
  },
});


export default HoursSelector
