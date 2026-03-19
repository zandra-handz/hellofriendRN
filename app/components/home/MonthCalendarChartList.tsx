import React, { useRef, useMemo, useState, useEffect } from "react";
import { FlatList, View, Pressable, Text, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";
import MonthCalendarChart from "./MonthCalendarChart";

type HelloLight = {
  id: string;
  date: string;
  past_date_in_words: string;
  type: string;
  user: number;
  location: number | null;
  freeze_effort_required?: number;
  freeze_priority_level?: number;
};

type Props = {
  helloesList: HelloLight[];
  primaryColor: string;
  overlayBackground: string;
  accentColor?: string;
};

const CARD_HEIGHT = 263;
const CALENDAR_PADDING = 24;
const MONTH_LABEL_HEIGHT = 21;
const WEEK_HEADER_HEIGHT = 16;
const MAX_ROWS = 6;
const CELL_SIZE = Math.floor(
  (CARD_HEIGHT - CALENDAR_PADDING - MONTH_LABEL_HEIGHT - WEEK_HEADER_HEIGHT) / MAX_ROWS
);
const CARD_WIDTH_SMALL = 90;
const CARD_GAP = 8;
const ANIM_DURATION = 80;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type MonthCardProps = {
  item: { year: number; month: number; helloes: HelloLight[]; realCount: number };
  isSelected: boolean;
  expandedWidth: number;
  primaryColor: string;
  overlayBackground: string;
  accentColor: string;
  onPress: () => void;
};

const CARD_HEIGHT_SMALL = Math.round(CARD_HEIGHT * 0.5);

const MonthCard = ({
  item,
  isSelected,
  expandedWidth,
  primaryColor,
  overlayBackground,
  accentColor,
  onPress,
}: MonthCardProps) => {
  const width = useSharedValue(isSelected ? expandedWidth : CARD_WIDTH_SMALL);
  const height = useSharedValue(isSelected ? CARD_HEIGHT : CARD_HEIGHT_SMALL);
  const chartOpacity = useSharedValue(isSelected ? 1 : 0);
  const labelOpacity = useSharedValue(isSelected ? 0 : 1);

  useEffect(() => {
    if (isSelected) {
      width.value = withTiming(expandedWidth, { duration: ANIM_DURATION });
      height.value = withTiming(CARD_HEIGHT, { duration: ANIM_DURATION });
      labelOpacity.value = withTiming(0, { duration: ANIM_DURATION * 0.4 });
      chartOpacity.value = withDelay(ANIM_DURATION, withTiming(1, { duration: ANIM_DURATION * 0.4 }));
    } else {
      width.value = withTiming(CARD_WIDTH_SMALL, { duration: ANIM_DURATION });
      height.value = withTiming(CARD_HEIGHT_SMALL, { duration: ANIM_DURATION });
      chartOpacity.value = withTiming(0, { duration: ANIM_DURATION * 0.4 });
      labelOpacity.value = withTiming(1, { duration: ANIM_DURATION });
    }
  }, [isSelected, expandedWidth]);

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    overflow: "hidden",
    borderRadius: 16,
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <Animated.View style={[containerStyle, { borderWidth: 0, borderColor: `${primaryColor}15` }]}>
      <Animated.View style={chartStyle}>
        <MonthCalendarChart
          helloesList={item.helloes}
          primaryColor={primaryColor}
          overlayBackground={overlayBackground}
          accentColor={accentColor}
          fixedYear={item.year}
          fixedMonth={item.month}
        />
      </Animated.View>

      <Animated.View style={labelStyle} pointerEvents={isSelected ? "none" : "auto"}>
        <Pressable onPress={onPress} style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Text style={[styles.smallMonth, { color: accentColor }]}>
            {MONTH_NAMES[item.month]}
          </Text>
          <Text style={[styles.smallYear, { color: `${primaryColor}60` }]}>
            {item.year}
          </Text>
          <View style={[styles.countBubble, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }]}>
            <Text style={[styles.countText, { color: accentColor }]}>
              {item.realCount}
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      {isSelected && (
        <Pressable
          onPress={onPress}
          hitSlop={12}
          style={[styles.collapseBtn, { borderColor: `${primaryColor}30` }]}
        >
          <Text style={[styles.collapseBtnText, { color: primaryColor }]}>✕</Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

const MonthCalendarChartList = ({
  helloesList = [],
  primaryColor,
  overlayBackground,
  accentColor = "#a0f143",
}: Props) => {
  const flatListRef = useRef(null);
  const { width: screenWidth } = useWindowDimensions();
  const expandedWidth = screenWidth;

  const months = useMemo(() => {
    const map: Record<string, { year: number; month: number; helloes: HelloLight[]; realCount: number }> = {};

    helloesList.forEach((h) => {
      if (!h.date) return;
      const d = new Date(h.date + "T00:00:00");
      const year = d.getFullYear();
      const month = d.getMonth();
      const key = `${year}-${String(month).padStart(2, "0")}`;
      if (!map[key]) map[key] = { year, month, helloes: [], realCount: 0 };
      map[key].helloes.push(h);
      if (!h.hasOwnProperty("manual_reset")) map[key].realCount++;
    });

    return Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => map[key]);
  }, [helloesList]);

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
  const defaultKey = months.find(
    (m) => `${m.year}-${String(m.month).padStart(2, "0")}` === currentKey
  )
    ? currentKey
    : months[0]
    ? `${months[0].year}-${String(months[0].month).padStart(2, "0")}`
    : null;

  const [selectedKey, setSelectedKey] = useState<string | null>(defaultKey);

  const scrollToKey = (key: string) => {
    if (!key || !months.length) return;
    const idx = months.findIndex(
      (m) => `${m.year}-${String(m.month).padStart(2, "0")}` === key
    );
    if (idx >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
      }, 50);
    }
  };

  useEffect(() => {
    if (defaultKey) scrollToKey(defaultKey);
  }, []);

  if (!months.length) return null;

  const handlePress = (key: string) => {
    setSelectedKey((prev) => {
      if (prev === key) return null;
      scrollToKey(key);
      return key;
    });
  };

  const isLocked = selectedKey !== null;

  return (
    <FlatList
      ref={flatListRef}
      data={months}
      horizontal
      scrollEnabled={!isLocked}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1 }}
      keyExtractor={(item) => `${item.year}-${item.month}`}
    //   contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: isLocked ? 0 : 12, alignItems: "center" }}
     contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: isLocked ? 0 : 12, alignItems: "flex-start" }}
      ListFooterComponent={<View style={{ width: 40 }} />}
      onScrollToIndexFailed={() => {}}
      renderItem={({ item }) => {
        const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
        const isSelected = selectedKey === key;
        return (
          <MonthCard
            item={item}
            isSelected={isSelected}
            expandedWidth={expandedWidth}
            primaryColor={primaryColor}
            overlayBackground={overlayBackground}
            accentColor={accentColor}
            onPress={() => handlePress(key)}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  smallMonth: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  smallYear: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 10,
    textAlign: "center",
  },
  countBubble: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: "center",
  },
  countText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 12,
  },
  collapseBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  collapseBtnText: {
    fontSize: 10,
    fontFamily: "SpaceGrotesk-Bold",
  },
});

export default MonthCalendarChartList;