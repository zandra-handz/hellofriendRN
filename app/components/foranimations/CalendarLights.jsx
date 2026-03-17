

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { View, Animated, FlatList, Text, StyleSheet, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import HelloDayWrapper from "@/app/components/helloes/HelloDayWrapper";
import manualGradientColors from "@/app/styles/StaticColors";

const CalendarLights = ({
  themeColors,
  onMonthPress,
  combinedData,
  daySquareBorderColor = "white",
  height,
  primaryOverlayColor,
}) => {
  // const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const flatListRef = useRef(null);
  const animationColor = themeColors.lightColor;
  const opacityMinusAnimation = 1;

  const indexDays = useMemo(
    () => ({
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    }),
    [],
  );


  // const handleSelectMonth = (item) => {
  //   onMonthPress(item);
  //   console.log(item.index)
  //   flatListRef.current?.scrollToIndex({
  //     index: item.index,
  //     animated: true
  //   })


  // };

  const handleSelectMonth = (item, index) => {
  onMonthPress(item);
  console.log("render index:", index);
  console.log("item.index:", item.index);

  flatListRef.current?.scrollToIndex({
    index,
    animated: true,
    viewPosition: 0,
  });
};

  const renderDay = useCallback(
    ({ item, lightUp, voidedDay, isManualReset, key, isPadding }) => {
      // Every cell is the same outer size for grid alignment
      const cellSize = 10;

      // Fully invisible for days that aren't part of the month (padding)
      if (isPadding || !item) {
        return (
          <View
            key={key}
            style={[
              styles.dayCell,
              { width: cellSize, height: cellSize, opacity: 0 },
            ]}
          />
        );
      }

      // Unlit days (part of the month but no helloe/red) → faded
      if (!lightUp) {
        return (
          <View
            key={key}
            style={[styles.dayCell, { width: cellSize, height: cellSize }]}
          >
            <View
              style={{
                borderColor: daySquareBorderColor,
                borderWidth: 1.5,
                backgroundColor: `${daySquareBorderColor}22`,
                height: 8,
                width: 8,
                borderRadius: 2,
                opacity: 0.15,
              }}
            />
          </View>
        );
      }

      // Lit day (helloe/red) → slightly bigger, solid
      const accentColor =
        voidedDay && !isManualReset
          ? manualGradientColors.dangerColor
          : voidedDay && isManualReset
            ? "gray"
            : animationColor;

      return (
        <Pressable
          key={key}
          hitSlop={20}
          onPress={() => console.log("removed for now")}
          style={[styles.dayCell, { width: cellSize, height: cellSize }]}
        >
          <HelloDayWrapper isVisible={lightUp}>
            <View
              style={[
                styles.daySquareLit,
                {
                  backgroundColor: primaryOverlayColor || accentColor,
                  borderColor: accentColor,
                  borderWidth: 1.5,
                  height: cellSize,
                  width: cellSize,
                },
              ]}
            />
          </HelloDayWrapper>
        </Pressable>
      );
    },
    [animationColor, daySquareBorderColor, primaryOverlayColor],
  );

  const renderWeeks = useCallback(
    (totalDays, startingIndex, highlightDays = []) => {
      const highlightMap = {};
      highlightDays.forEach((d) => {
        const key = Object.keys(d)[0];
        highlightMap[key] = d[key];
      });

      const allDays = [];
      // padding before the first day → mark as isPadding
      for (let i = 0; i < startingIndex; i++) allDays.push({ isPadding: true });
      for (let day = 1; day <= totalDays; day++) allDays.push(day);
      // padding after the last day
      while (allDays.length % 7 !== 0) allDays.push({ isPadding: true });

      const numberOfRows = allDays.length / 7;

      return (
        <View>
          {Array.from({ length: numberOfRows }, (_, rowIndex) => {
            const rowStart = rowIndex * 7;
            const weekData = allDays.slice(rowStart, rowStart + 7);

            return (
              <View style={styles.weekRow} key={`week-${rowIndex}`}>
                {weekData.map((day, index) => {
                  if (day.isPadding) {
                    return renderDay({
                      key: `day-${rowStart + index}`,
                      isPadding: true,
                    });
                  }

                  const dayObj = highlightMap[day];
                  return renderDay({
                    item: day,
                    lightUp: !!dayObj,
                    voidedDay: dayObj?.voided,
                    isManualReset: dayObj?.manual,
                    key: `day-${rowStart + index}`,
                    isPadding: false,
                  });
                })}
              </View>
            );
          })}
        </View>
      );
    },
    [renderDay],
  );

  const renderCalendarMonth = useCallback(
    ({ item, index }) => {
      const startIndex = indexDays[item.monthData.startsOn];
      const highlightDays = item.helloData?.days || [];

      const month = item.monthData.month.slice(0, 3);
      const year = item.monthData.year.slice(0, 4);

      return (
        <View style={styles.calendarContainer}>
          <Pressable
            onPress={() => handleSelectMonth(item, index)}
            style={({ pressed }) => ({
             // backgroundColor: pressed ? "darkorange" : "transparent",
              borderRadius: 999,
              marginBottom: 14,

              // alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 13,
                opacity: opacityMinusAnimation,
                color: daySquareBorderColor,
              }}
            >
              {month} {year}
            </Text>
          </Pressable>

          <View style={styles.innerCalendarContainer}>
            {renderWeeks(item.monthData.daysInMonth, startIndex, highlightDays)}
          </View>
        </View>
      );
    },
    [indexDays, renderWeeks, onMonthPress, daySquareBorderColor],
  );

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={combinedData}
        horizontal
        estimatedItemSize={120}
        // drawDistance={200}
        showsHorizontalScrollIndicator={false} 
      ListFooterComponent={<View style={{ width: 600 }} />}
        // keyExtractor={(item) =>
        //   `${item.monthData.month}-${item.monthData.year}`
        // }
        keyExtractor={(item) => {
          const key = `${item.index}-${item.monthData.month}-${item.monthData.year}`;
          // console.log("FlashList key:", key);
          return key;
        }}
        renderItem={renderCalendarMonth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "100%",
    borderRadius: 20,
    padding: 10,
  },

  calendarContainer: {
    height: 120,
    //backgroundColor: "brown",
    marginRight: 10,
    padding: 4,
    width: 110,
    borderRadius: 10,
    padding: 10,
  },

  innerCalendarContainer: {
    flex: 1,
  },

  weekRow: {
    flexDirection: "row",
    width: "100%",
    height: 12, // cellSize (10) + margin (1) * 2
  },

  // Fixed-size grid cell — every day occupies the same space
  dayCell: {
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },

  daySquareLit: {
    borderRadius: 2,
  },
});

export default React.memo(CalendarLights);
