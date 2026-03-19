// import React, { useMemo } from "react";
// import { View, Text, Pressable, StyleSheet } from "react-native";
// import manualGradientColors from "@/app/styles/StaticColors";

// type HelloLight = {
//   id: string;
//   date: string;
//   past_date_in_words: string;
//   type: string;
//   user: number;
//   location: number | null;
//   freeze_effort_required?: number;
//   freeze_priority_level?: number;
// };

// type Props = {
//   helloesList: HelloLight[];
//   primaryColor: string;
//   overlayBackground: string;
//   accentColor?: string;
//   fixedYear?: number;
//   fixedMonth?: number;
//   cellSize?: number;
//   selectedId?: string | null;
//   onSelectedIdChange?: (id: string | null) => void;
// };

// const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// const MONTH_NAMES = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// function getDaysInMonth(year: number, month: number) {
//   return new Date(year, month + 1, 0).getDate();
// }
// function getStartDayOfWeek(year: number, month: number) {
//   return new Date(year, month, 1).getDay();
// }
// function seededRand(seed: number) {
//   const x = Math.sin(seed) * 10000;
//   return x - Math.floor(x);
// }
// function getDotPositions(helloIds: string[], cellSize: number, dotSize: number): { x: number; y: number }[] {
//   const pad = dotSize / 2 + 1;
//   const range = cellSize - dotSize - 2;
//   return helloIds.map((id, i) => {
//     const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1) + i * 137;
//     return {
//       x: pad + seededRand(seed) * range,
//       y: pad + seededRand(seed + 1) * range,
//     };
//   });
// }

// const CARD_HEIGHT = 263;
// const CALENDAR_PADDING = 24;
// const MONTH_LABEL_HEIGHT = 21;
// const WEEK_HEADER_HEIGHT = 16;
// const MAX_ROWS = 6;
// const DEFAULT_CELL_SIZE = Math.floor(
//   (CARD_HEIGHT - CALENDAR_PADDING - MONTH_LABEL_HEIGHT - WEEK_HEADER_HEIGHT) / MAX_ROWS
// );
// const DOT_SIZE = 6;

// const MonthCalendarChartV2 = ({
//   helloesList = [],
//   primaryColor = "#ffffff",
//   accentColor = "#a0f143",
//   fixedYear,
//   fixedMonth,
//   cellSize: cellSizeProp,
//   selectedId = null,
//   onSelectedIdChange,
// }: Props) => {
//   const now = new Date();
//   const year = fixedYear ?? now.getFullYear();
//   const month = fixedMonth ?? now.getMonth();
//   const cellSize = cellSizeProp ?? DEFAULT_CELL_SIZE;

//   const toggleId = (id: string) => {
//     onSelectedIdChange?.(selectedId === id ? null : id);
//   };

//   const daysInMonth = getDaysInMonth(year, month);
//   const startDay = getStartDayOfWeek(year, month);

//   const hellosByDay = useMemo(() => {
//     const helloes: Record<number, HelloLight[]> = {};
//     const resets: Record<number, HelloLight[]> = {};
//     helloesList.forEach((h) => {
//       if (!h.date) return;
//       const d = new Date(h.date + "T00:00:00");
//       if (d.getFullYear() === year && d.getMonth() === month) {
//         const day = d.getDate();
//         if (h.hasOwnProperty("manual_reset")) {
//           if (!resets[day]) resets[day] = [];
//           resets[day].push(h);
//         } else {
//           if (!helloes[day]) helloes[day] = [];
//           helloes[day].push(h);
//         }
//       }
//     });
//     return { helloes, resets };
//   }, [helloesList, year, month]);

//   const dotPositionsByDay = useMemo(() => {
//     const result: Record<number, { x: number; y: number }[]> = {};
//     Object.entries(hellosByDay.helloes).forEach(([day, helloes]) => {
//       result[Number(day)] = getDotPositions(helloes.map((h) => h.id), cellSize, DOT_SIZE);
//     });
//     return result;
//   }, [hellosByDay, cellSize]);

//   const cells: (number | null)[] = useMemo(() => {
//     const c: (number | null)[] = [];
//     for (let i = 0; i < startDay; i++) c.push(null);
//     for (let d = 1; d <= daysInMonth; d++) c.push(d);
//     while (c.length % 7 !== 0) c.push(null);
//     return c;
//   }, [startDay, daysInMonth]);

//   const rows = cells.length / 7;

//   return (
//     <View style={{ backgroundColor: "transparent" }}>
//       <View style={{ width: cellSize * 7 }}>
//         <Text style={[styles.monthLabel, { color: accentColor }]}>
//           {MONTH_NAMES[month]} {year}
//         </Text>

//         <View style={styles.weekHeader}>
//           {DAYS.map((d) => (
//             <Text key={d} style={[styles.dayHeader, { width: cellSize, color: primaryColor }]}>
//               {d}
//             </Text>
//           ))}
//         </View>

//         {Array.from({ length: rows }, (_, rowIdx) => (
//           <View key={rowIdx} style={{ flexDirection: "row" }}>
//             {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
//               if (!day) {
//                 return <View key={colIdx} style={{ width: cellSize, height: cellSize }} />;
//               }

//               const helloes = hellosByDay.helloes[day] ?? [];
//               const resets = hellosByDay.resets[day] ?? [];
//               const hasHello = helloes.length > 0;
//               const positions = dotPositionsByDay[day] ?? [];

//               return (
//                 <View key={colIdx} style={{ width: cellSize, height: cellSize, position: "relative" }}>
//                   <View style={[styles.dayBackground, { borderColor: `${primaryColor}15` }]}>
//                     <Text style={[styles.dayNumber, { color: hasHello ? `${accentColor}80` : `${primaryColor}25` }]}>
//                       {day}
//                     </Text>
//                   </View>

//                   {resets.length > 0 && (
//                     <View
//                       style={[
//                         styles.resetSquare,
//                         {
//                           backgroundColor: resets.some((r) => !r.manual_reset)
//                             ? `${manualGradientColors.dangerColor}60`
//                             : `${primaryColor}25`,
//                           borderColor: resets.some((r) => !r.manual_reset)
//                             ? manualGradientColors.dangerColor
//                             : `${primaryColor}30`,
//                         },
//                       ]}
//                     />
//                   )}

//                   {helloes.map((h, i) => {
//                     const pos = positions[i] ?? { x: cellSize / 2, y: cellSize / 2 };
//                     const isSelected = selectedId === h.id;
//                     return (
//                       <Pressable
//                         key={h.id}
//                         hitSlop={4}
//                         onPress={() => toggleId(h.id)}
//                         style={[
//                           styles.helloDot,
//                           {
//                             left: pos.x,
//                             top: pos.y,
//                             width: DOT_SIZE,
//                             height: DOT_SIZE,
//                             borderRadius: DOT_SIZE / 2,
//                             backgroundColor: isSelected ? accentColor : `${accentColor}70`,
//                             borderColor: accentColor,
//                             borderWidth: isSelected ? 1.5 : 1,
//                             transform: [{ scale: isSelected ? 1.4 : 1 }],
//                           },
//                         ]}
//                       />
//                     );
//                   })}
//                 </View>
//               );
//             })}
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   monthLabel: {
//     fontFamily: "SpaceGrotesk-Bold",
//     fontSize: 13,
//     marginBottom: 8,
//     letterSpacing: 0.5,
//   },
//   weekHeader: {
//     flexDirection: "row",
//     marginBottom: 2,
//   },
//   dayHeader: {
//     textAlign: "center",
//     fontSize: 10,
//     opacity: 0.4,
//     fontFamily: "SpaceGrotesk-Regular",
//   },
//   dayBackground: {
//     position: "absolute",
//     top: 2,
//     left: 2,
//     right: 2,
//     bottom: 2,
//     borderRadius: 6,
//     borderWidth: 1,
//     justifyContent: "flex-end",
//     alignItems: "flex-start",
//     padding: 2,
//   },
//   dayNumber: {
//     fontSize: 8,
//     fontFamily: "SpaceGrotesk-Regular",
//   },
//   helloDot: {
//     position: "absolute",
//   },
//   resetSquare: {
//     position: "absolute",
//     bottom: 3,
//     right: 3,
//     width: 5,
//     height: 5,
//     borderRadius: 1,
//     borderWidth: 1,
//   },
// });

// export default MonthCalendarChartV2;


import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
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
  cellSize?: number;
  selectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
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

const CARD_HEIGHT = 263;
const CALENDAR_PADDING = 24;
const MONTH_LABEL_HEIGHT = 21;
const WEEK_HEADER_HEIGHT = 16;
const MAX_ROWS = 6;
const DEFAULT_CELL_SIZE = Math.floor(
  (CARD_HEIGHT - CALENDAR_PADDING - MONTH_LABEL_HEIGHT - WEEK_HEADER_HEIGHT) / MAX_ROWS
);

const MonthCalendarChartV2 = ({
  helloesList = [],
  primaryColor = "#ffffff",
  accentColor = "#a0f143",
  fixedYear,
  fixedMonth,
  cellSize: cellSizeProp,
  selectedId = null,
  onSelectedIdChange,
}: Props) => {
  const now = new Date();
  const year = fixedYear ?? now.getFullYear();
  const month = fixedMonth ?? now.getMonth();
  const cellSize = cellSizeProp ?? DEFAULT_CELL_SIZE;

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
    // Sort each day oldest first so cycling goes oldest → newest
    Object.keys(helloes).forEach((day) => {
      helloes[Number(day)].sort((a, b) => a.date.localeCompare(b.date));
    });
    return { helloes, resets };
  }, [helloesList, year, month]);

  const cells: (number | null)[] = useMemo(() => {
    const c: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) c.push(null);
    for (let d = 1; d <= daysInMonth; d++) c.push(d);
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [startDay, daysInMonth]);

  const rows = cells.length / 7;

  // When a cell is pressed: if nothing selected in this cell → select first hello.
  // If current selectedId is in this cell → advance to next, or deselect if at end.
  const handleCellPress = (helloes: HelloLight[]) => {
    if (!helloes.length) return;
    const currentIdx = helloes.findIndex((h) => h.id === selectedId);
    if (currentIdx === -1) {
      // Nothing in this cell selected — select first (oldest)
      onSelectedIdChange?.(helloes[0].id);
    } else if (currentIdx < helloes.length - 1) {
      // Advance to next
      onSelectedIdChange?.(helloes[currentIdx + 1].id);
    } else {
      // At end — deselect
      onSelectedIdChange?.(null);
    }
  };

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <View style={{ width: cellSize * 7 }}>
        <Text style={[styles.monthLabel, { color: accentColor }]}>
          {MONTH_NAMES[month]} {year}
        </Text>

        <View style={styles.weekHeader}>
          {DAYS.map((d) => (
            <Text key={d} style={[styles.dayHeader, { width: cellSize, color: primaryColor }]}>
              {d}
            </Text>
          ))}
        </View>

        {Array.from({ length: rows }, (_, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: "row" }}>
            {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
              if (!day) {
                return <View key={colIdx} style={{ width: cellSize, height: cellSize }} />;
              }

              const helloes = hellosByDay.helloes[day] ?? [];
              const resets = hellosByDay.resets[day] ?? [];
              const hasHello = helloes.length > 0;

              // Is any hello in this cell currently selected?
              const selectedInCell = helloes.find((h) => h.id === selectedId) ?? null;
              const isCellSelected = selectedInCell !== null;
              const selectedIndexInCell = helloes.findIndex((h) => h.id === selectedId);

              return (
                <View
                  key={colIdx}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    // Pop the cell out when selected
                    transform: [{ scale: isCellSelected ? 1.15 : 1 }],
                    zIndex: isCellSelected ? 10 : 1,
                  }}
                >
                  <Pressable
                    onPress={() => handleCellPress(helloes)}
                    disabled={!hasHello}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={[
                        styles.dayBackground,
                        {
                          borderColor: isCellSelected
                            ? accentColor
                            : hasHello
                            ? `${accentColor}40`
                            : `${primaryColor}15`,
                          backgroundColor: isCellSelected
                            ? `${accentColor}20`
                            : hasHello
                            ? `${accentColor}08`
                            : "transparent",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          {
                            color: isCellSelected
                              ? accentColor
                              : hasHello
                              ? `${accentColor}80`
                              : `${primaryColor}25`,
                          },
                        ]}
                      >
                        {day}
                      </Text>

                      {/* Dot(s) indicator — filled square, count badge if multiple */}
                      {hasHello && (
                        <View style={styles.dotArea}>
                          <View
                            style={[
                              styles.dot,
                              {
                                backgroundColor: isCellSelected ? accentColor : `${accentColor}60`,
                              },
                            ]}
                          />
                          {helloes.length > 1 && (
                            <Text style={[styles.dotCount, { color: isCellSelected ? accentColor : `${accentColor}80` }]}>
                              {isCellSelected
                                ? `${selectedIndexInCell + 1}/${helloes.length}`
                                : `${helloes.length}`}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>

                    {resets.length > 0 && (
                      <View
                        style={[
                          styles.resetSquare,
                          {
                            backgroundColor: resets.some((r) => !r.manual_reset)
                              ? `${manualGradientColors.dangerColor}60`
                              : `${primaryColor}25`,
                            borderColor: resets.some((r) => !r.manual_reset)
                              ? manualGradientColors.dangerColor
                              : `${primaryColor}30`,
                          },
                        ]}
                      />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign: "center",
    fontSize: 10,
    opacity: 0.4,
    fontFamily: "SpaceGrotesk-Regular",
  },
  dayBackground: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 3,
    flexDirection: "column",
  },
  dayNumber: {
    fontSize: 8,
    fontFamily: "SpaceGrotesk-Regular",
  },
  dotArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-end",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotCount: {
    fontSize: 7,
    fontFamily: "SpaceGrotesk-Bold",
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
});

export default MonthCalendarChartV2;