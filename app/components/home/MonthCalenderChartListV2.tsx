import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import MonthCalendarChartV2 from "./MonthCalendarChartV2";

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
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedKey: string | null;
  setSelectedKey: (key: string | null) => void;
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LABEL_GAP = 4;
const LABEL_PX = 8;
const LABEL_PY = 6;
const LABEL_RADIUS = 8;
const LABEL_FONT = 12;
const LABEL_YEAR_FONT = 10;

const SIDEBAR_WIDTH = 90;
const MINI_CELL = 4;
const MINI_DOT = 3;
const MINI_COLS = 7;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getStartDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type MiniCalProps = {
  helloes: HelloLight[];
  year: number;
  month: number;
  accentColor: string;
  primaryColor: string;
};

const MiniCalendar = ({ helloes, year, month, accentColor, primaryColor }: MiniCalProps) => {
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfWeek(year, month);

  const helloDays = useMemo(() => {
    const set = new Set<number>();
    helloes.forEach((h) => {
      if (!h.date || h.hasOwnProperty("manual_reset")) return;
      const d = new Date(h.date + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) set.add(d.getDate());
    });
    return set;
  }, [helloes, year, month]);

  const cells: (number | null)[] = useMemo(() => {
    const c: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) c.push(null);
    for (let d = 1; d <= daysInMonth; d++) c.push(d);
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [startDay, daysInMonth]);

  const rows = cells.length / 7;

  return (
    <View style={{ width: MINI_COLS * MINI_CELL, height: rows * MINI_CELL }}>
      {Array.from({ length: rows }, (_, rowIdx) => (
        <View key={rowIdx} style={{ flexDirection: "row" }}>
          {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
            const hasHello = day !== null && helloDays.has(day);
            return (
              <View key={colIdx} style={{ width: MINI_CELL, height: MINI_CELL, alignItems: "center", justifyContent: "center" }}>
                {hasHello ? (
                  <View style={{ width: MINI_DOT, height: MINI_DOT, borderRadius: MINI_DOT / 2, backgroundColor: accentColor }} />
                ) : day !== null ? (
                  <View style={{ width: 1.5, height: 1.5, borderRadius: 1, backgroundColor: `${primaryColor}20` }} />
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const MonthCalendarChartListV2 = ({
  helloesList = [],
  primaryColor,
  overlayBackground,
  accentColor = "#a0f143",
  selectedId,
  setSelectedId,
  selectedKey,
  setSelectedKey,
}: Props) => {
  const sidebarRef = useRef<ScrollView>(null);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);

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

  const totalHelloes = useMemo(
    () => months.reduce((sum, m) => sum + m.realCount, 0),
    [months]
  );

  const selectedMonth = useMemo(
    () => months.find((m) => `${m.year}-${String(m.month).padStart(2, "0")}` === selectedKey) ?? null,
    [months, selectedKey]
  );

  const labelRowHeight = LABEL_PY * 2 + LABEL_FONT + LABEL_YEAR_FONT + 2;

  const scrollSidebarToIndex = (idx: number) => {
    setTimeout(() => {
      sidebarRef.current?.scrollTo({ y: idx * (labelRowHeight + LABEL_GAP), animated: true });
    }, 50);
  };

  useEffect(() => {
    if (!defaultKey || !months.length) return;
    const idx = months.findIndex(
      (m) => `${m.year}-${String(m.month).padStart(2, "0")}` === defaultKey
    );
    if (idx >= 0) scrollSidebarToIndex(idx);
  }, []);

  const onPanelLayout = useCallback((e: LayoutChangeEvent) => {
    setPanelWidth(e.nativeEvent.layout.width);
  }, []);

  const cellSize = panelWidth !== null ? Math.floor(panelWidth / 7) : null;

  if (!months.length) return null;

  const handleSelect = (key: string) => {
    if (selectedKey === key) {
      setSelectedKey(null);
      setSelectedId(null);
      return;
    }
    setSelectedId(null);
    setSelectedKey(key);
    const idx = months.findIndex(
      (m) => `${m.year}-${String(m.month).padStart(2, "0")}` === key
    );
    if (idx >= 0) scrollSidebarToIndex(idx);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.panel}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.panelContent}
        onLayout={onPanelLayout}
      >
        {selectedMonth && cellSize !== null ? (
          <MonthCalendarChartV2
            helloesList={selectedMonth.helloes}
            primaryColor={primaryColor}
            overlayBackground={overlayBackground}
            accentColor={accentColor}
            fixedYear={selectedMonth.year}
            fixedMonth={selectedMonth.month}
            cellSize={cellSize}
            selectedId={selectedId}
            onSelectedIdChange={setSelectedId}
          />
        ) : (
          <View style={styles.allView}>
            <Text style={[styles.allCount, { color: accentColor }]}>
              {totalHelloes}
            </Text>
            <Text style={[styles.allLabel, { color: `${primaryColor}40` }]}>
              helloes total
            </Text>
          </View>
        )}
      </ScrollView>

      <ScrollView
        ref={sidebarRef}
        style={styles.sidebar}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sidebarContent}
      >
        {months.map((item) => {
          const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
          const isSelected = selectedKey === key;
          return (
            <Pressable
              key={key}
              onPress={() => handleSelect(key)}
              style={[
                styles.label,
                {
                  backgroundColor: isSelected ? `${accentColor}20` : "transparent",
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: isSelected ? accentColor : "transparent",
                },
              ]}
            >
              <View style={styles.labelTextBlock}>
                <Text style={[styles.labelMonth, { color: isSelected ? accentColor : `${primaryColor}60` }]}>
                  {MONTH_NAMES[item.month]}
                </Text>
                <Text style={[styles.labelYear, { color: isSelected ? `${accentColor}70` : `${primaryColor}30` }]}>
                  {item.year}
                </Text>
              </View>
              <MiniCalendar
                helloes={item.helloes}
                year={item.year}
                month={item.month}
                accentColor={accentColor}
                primaryColor={primaryColor}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  panel: {
    flex: 1,
  },
  panelContent: {
    paddingBottom: 24,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
    flexGrow: 0,
  },
  sidebarContent: {
    gap: LABEL_GAP,
    paddingVertical: 4,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: LABEL_PX,
    paddingVertical: LABEL_PY,
    borderRadius: LABEL_RADIUS,
  },
  labelTextBlock: {
    flexDirection: "column",
  },
  labelMonth: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: LABEL_FONT,
  },
  labelYear: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: LABEL_YEAR_FONT,
    opacity: 0.8,
  },
  allView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  allCount: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 64,
    lineHeight: 68,
  },
  allLabel: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    marginTop: 6,
  },
});

export default MonthCalendarChartListV2;