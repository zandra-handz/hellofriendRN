import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import manualGradientColors from "@/app/styles/StaticColors";

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
  fixedYear?: number;
  fixedMonth?: number;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatTypeShort(type: string): string {
  if (!type) return "—";
  if (type.toLowerCase().includes("in person")) return "in person";
  if (type.toLowerCase().includes("text") || type.toLowerCase().includes("social")) return "text / social";
  if (type.toLowerCase().includes("call") || type.toLowerCase().includes("phone")) return "call";
  return type;
}

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDotPositions(helloIds: string[], cellSize: number, dotSize: number): { x: number; y: number }[] {
  const pad = dotSize / 2 + 1;
  const range = cellSize - dotSize - 2;
  return helloIds.map((id, i) => {
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1) + i * 137;
    return {
      x: pad + seededRand(seed) * range,
      y: pad + seededRand(seed + 1) * range,
    };
  });
}

const CARD_HEIGHT = 263;
const CALENDAR_PADDING = 24;
const MONTH_LABEL_HEIGHT = 21;
const WEEK_HEADER_HEIGHT = 16;
const MAX_ROWS = 6;
const CELL_SIZE = Math.floor(
  (CARD_HEIGHT - CALENDAR_PADDING - MONTH_LABEL_HEIGHT - WEEK_HEADER_HEIGHT) / MAX_ROWS
);
const DOT_SIZE = 6;

const MonthCalendarChart = ({
  helloesList = [],
  primaryColor = "#ffffff",
  overlayBackground = "#1a1a1a",
  accentColor = "#a0f143",
  fixedYear,
  fixedMonth,
}: Props) => {
  const now = new Date();
  const [year] = useState(fixedYear ?? now.getFullYear());
  const [month] = useState(fixedMonth ?? now.getMonth());

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfWeek(year, month);

  const hellosByDay = useMemo(() => {
    const helloes: Record<number, HelloLight[]> = {};
    const resets: Record<number, HelloLight[]> = {};
    helloesList.forEach((h) => {
      if (!h.date) return;
      const d = new Date(h.date + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (h.hasOwnProperty("manual_reset")) {
          if (!resets[day]) resets[day] = [];
          resets[day].push(h);
        } else {
          if (!helloes[day]) helloes[day] = [];
          helloes[day].push(h);
        }
      }
    });
    return { helloes, resets };
  }, [helloesList, year, month]);

  const allHelloes = useMemo(() => {
    return Object.entries(hellosByDay.helloes)
      .sort(([a], [b]) => Number(a) - Number(b))
      .flatMap(([, hs]) => hs);
  }, [hellosByDay]);

  const dotPositionsByDay = useMemo(() => {
    const result: Record<number, { x: number; y: number }[]> = {};
    Object.entries(hellosByDay.helloes).forEach(([day, helloes]) => {
      result[Number(day)] = getDotPositions(helloes.map(h => h.id), CELL_SIZE, DOT_SIZE);
    });
    return result;
  }, [hellosByDay]);

  const cells: (number | null)[] = useMemo(() => {
    const c: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) c.push(null);
    for (let d = 1; d <= daysInMonth; d++) c.push(d);
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [startDay, daysInMonth]);

  const rows = cells.length / 7;

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <View style={styles.calendarSide}>
        <Text style={[styles.monthLabel, { color: accentColor }]}>
          {MONTH_NAMES[month]} {year}
        </Text>

        <View style={styles.weekHeader}>
          {DAYS.map((d) => (
            <Text key={d} style={[styles.dayHeader, { color: primaryColor }]}>
              {d}
            </Text>
          ))}
        </View>

        {Array.from({ length: rows }, (_, rowIdx) => (
          <View key={rowIdx} style={styles.weekRow}>
            {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
              if (!day) {
                return <View key={colIdx} style={styles.cell} />;
              }

              const helloes = hellosByDay.helloes[day] ?? [];
              const resets = hellosByDay.resets[day] ?? [];
              const hasHello = helloes.length > 0;
              const hasReset = resets.length > 0;
              const positions = dotPositionsByDay[day] ?? [];

              return (
                <View key={colIdx} style={styles.cell}>
                  <View
                    style={[
                      styles.dayBackground,
                      {
                        // backgroundColor: `${primaryColor}08`,
                        borderColor: `${primaryColor}15`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        { color: hasHello ? `${accentColor}80` : `${primaryColor}25` },
                      ]}
                    >
                      {day}
                    </Text>
                  </View>

                  {hasReset && (
                    <View
                      style={[
                        styles.resetSquare,
                        {
                          backgroundColor: resets.some(r => !r.manual_reset)
                            ? `${manualGradientColors.dangerColor}60`
                            : `${primaryColor}25`,
                          borderColor: resets.some(r => !r.manual_reset)
                            ? manualGradientColors.dangerColor
                            : `${primaryColor}30`,
                        },
                      ]}
                    />
                  )}

                  {helloes.map((h, i) => {
                    const pos = positions[i] ?? { x: CELL_SIZE / 2, y: CELL_SIZE / 2 };
                    const isSelected = selectedId === h.id;
                    return (
                      <Pressable
                        key={h.id}
                        hitSlop={4}
                        onPress={() => setSelectedId((prev) => (prev === h.id ? null : h.id))}
                        style={[
                          styles.helloDot,
                          {
                            left: pos.x,
                            top: pos.y,
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            borderRadius: DOT_SIZE / 2,
                            backgroundColor: isSelected ? accentColor : `${accentColor}70`,
                            borderColor: accentColor,
                            borderWidth: isSelected ? 1.5 : 1,
                            transform: [{ scale: isSelected ? 1.4 : 1 }],
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.listSide}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {allHelloes.length === 0 && (
          <Text style={[styles.emptyText, { color: `${primaryColor}40` }]}>
            no helloes this month
          </Text>
        )}
        {allHelloes.map((h) => {
          const isHighlighted = selectedId === h.id;
          return (
            <Pressable
              key={h.id}
              onPress={() => setSelectedId((prev) => (prev === h.id ? null : h.id))}
              style={[
                styles.helloRow,
                {
                  backgroundColor: isHighlighted ? `${accentColor}18` : "transparent",
                  borderColor: isHighlighted ? accentColor : `${primaryColor}15`,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.helloDate, { color: accentColor }]}>
                {h.past_date_in_words}
              </Text>
              <Text
                style={[styles.helloType, { color: primaryColor }]}
                numberOfLines={1}
              >
                {formatTypeShort(h.type)}
              </Text>
            </Pressable>
          );
        })}
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 20,
    paddingHorizontal: 12,
    gap: 12,
    flex: 1,
  },
  calendarSide: {
    flexShrink: 0,
    width: CELL_SIZE * 7,
  },
  monthLabel: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 2,
  },
  dayHeader: {
    width: CELL_SIZE,
    textAlign: "center",
    fontSize: 10,
    opacity: 0.4,
    fontFamily: "SpaceGrotesk-Regular",
  },
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: "relative",
  },
  dayBackground: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 2,
  },
  dayNumber: {
    fontSize: 8,
    fontFamily: "SpaceGrotesk-Regular",
  },
  helloDot: {
    position: "absolute",
  },
  resetSquare: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 1,
    borderWidth: 1,
  },
  listSide: {
    flex: 1,
  },
  listContent: {
    gap: 6,
    paddingTop: 2,
  },
  helloRow: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  helloDate: {
    fontSize: 10,
    fontFamily: "SpaceGrotesk-Bold",
    letterSpacing: 0.3,
  },
  helloType: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk-Regular",
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk-Regular",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MonthCalendarChart;