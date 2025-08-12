import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Animated,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import HelloDayWrapper from "@/app/components/helloes/HelloDayWrapper";
import MomentsSearchBar from "../moments/MomentsSearchBar";
import { showHelperMessage } from "@/src/utils/ShowHelperMessage";
import { ShowQuickView } from "@/src/utils/ShowQuickView";
import { daysSincedDateField } from "@/src/utils/DaysSince";

import { useHelloes } from "@/src/context/HelloesContext";
import HelloQuickView from "../alerts/HelloQuickView";

const CalendarLights = ({
  onMonthPress,
  combinedData,
  daySquareBorderColor = "white",
  daySquareBorderRadius = 0,
  // opacityMinusAnimation=1,
  animationColor = "orange",
}) => {
  // const [combinedData, setCombinedData] = useState([]);
  const { helloesList } = useHelloes();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const backgroundColor = "transparent"; // use this to give just the calendar tray a background color. borderRadius already set
  const opacityMinusAnimation = 1;
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the end without animation when the component mounts
    // doesn't work!
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, []);

  const handleViewHello = (id) => {
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject != undefined) {
      const daysSince = daysSincedDateField(helloObject.date);

      const word = Number(daysSince) != 1 ? `days` : `day`;
      console.log("helloobject@@");
      ShowQuickView({
        topBarText: `Hello on ${helloObject.past_date_in_words}   |   ${daysSince} ${word} ago`,
        view: <HelloQuickView data={helloObject} index={helloIndex} />,
        message: `hi hi hi`,
        update: false,
      });
    }
  };

  const indexDays = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const renderDay = ({ item, lightUp, voidedDay, id, isManualReset, key }) => {
    //console.log(item);

    if (!item) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            {
              opacity: opacityMinusAnimation,
              borderRadius: daySquareBorderRadius,
              borderColor: daySquareBorderColor,
              backgroundColor: "transparent",
              opacity: 0,
            },
          ]}
          // key={`day-${rowStart }`}
        ></View>
      );
    }

    if (!lightUp) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            {
              opacity: opacityMinusAnimation,
              borderRadius: daySquareBorderRadius,
              borderColor: daySquareBorderColor,
              backgroundColor: "transparent",
            },
          ]}
          // key={`day-${rowStart + index}`}
        ></View>
      );
    }
    if (lightUp) {
      //console.log("yes", item);
      return (
        <AnimatedPressable
          hitSlop={20}
          onPress={() => handleViewHello(id)}
          key={key}
          style={{ height: 10, width: 10, overflow: "hidden" }}
        >
          <HelloDayWrapper isVisible={lightUp}>
            <Animated.View
              style={[
                styles.daySquare,
                {
                  borderRadius: daySquareBorderRadius,
                  backgroundColor:
                    voidedDay && !isManualReset
                      ? "red"
                      : voidedDay && isManualReset
                        ? "gray"
                        : animationColor,
                },
              ]}
              // key={`day-${rowStart + index}`}
            ></Animated.View>
          </HelloDayWrapper>
        </AnimatedPressable>
      );
    }
  };
  const renderWeeks = (totalDays, startingIndex, highlightDays = []) => {
    // Generate all days of the month including filler days
    const allDays = [];

    // console.error(highlightDays);

    // Previous month's filler days
    for (let i = 0; i < startingIndex; i++) {
      allDays.push(null);
    }

    // Current month's days
    for (let day = 1; day <= totalDays; day++) {
      allDays.push(day);
    }

    // Next month's filler days to fill last week
    while (allDays.length % 7 !== 0) {
      allDays.push(null);
    }

    const numberOfRows = allDays.length / 7;

    return (
      <View>
        {Array.from({ length: numberOfRows }, (_, rowIndex) => {
          const rowStart = rowIndex * 7;
          const rowEnd = rowStart + 7;

          const weekData = allDays.slice(rowStart, rowEnd);

          return (
            <View style={styles.weekRow} key={`week-${rowIndex}`}>
              {weekData.map((day, index) => {
                if (day === null) {
                  // filler day - no highlight or void
                  return renderDay({
                    item: day,
                    lightUp: false,
                    voidedDay: false,
                    isManualReset: false,
                    id: null,
                    key: `day-${rowStart + index}`,
                  });
                }

                // Find day object in highlightDays
                const dayObj = highlightDays.find((d) => d.hasOwnProperty(day));

                // If dayObj exists, lightUp = true, else false
                const lightUp = !!dayObj;

                // Extract voided and manual flags if dayObj exists
                const voidedDay = dayObj ? dayObj[day].voided : false;
                const isManualReset = dayObj ? dayObj[day].manual : false;
                const id = dayObj ? dayObj[day].id : false;

                return renderDay({
                  item: day,
                  lightUp,
                  voidedDay,
                  isManualReset,
                  id,
                  key: `day-${rowStart + index}`,
                });
              })}
            </View>
          );
        })}
      </View>
    );
  };

  

  const renderCalendarMonth = useCallback(
    ({ item }) => {
      // console.log(item.helloData);
      const indexRangeStart = indexDays[item.monthData.startsOn];
      // const indexRangeTotal = item.monthData.daysInMonth - 1 + indexRangeStart;

      const highlightDays = item.helloData?.days || [];

      const month = item.monthData.month.slice(0, 3);
      const year = item.monthData.year.slice(0, 4);

      return (
        <View style={styles.calendarContainer}>
          <AnimatedPressable onPress={() => onMonthPress(item)}>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 12,
                opacity: opacityMinusAnimation,
                color: daySquareBorderColor,
              }}
            >
              {month} {year}
            </Text>
          </AnimatedPressable>
          <View style={styles.innerCalendarContainer}>
            {renderWeeks(
              item.monthData.daysInMonth,
              indexRangeStart,
              highlightDays
            )}
          </View>
        </View>
      );
    },
    [
      indexDays,
      opacityMinusAnimation,
      daySquareBorderColor,
      renderWeeks,
      styles.calendarContainer,
      styles.innerCalendarContainer,
    ]
  );

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {combinedData && (
        <FlatList
          ref={flatListRef}
          data={combinedData}
          horizontal
          showsHorizontalScrollIndicator={false}
          initialNumToRender={30}
          keyExtractor={(item, index) =>
            `${item.monthData.month}-${item.monthData.year}`
          } // Use month and year as key
          renderItem={renderCalendarMonth}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "100%",
    height: 100,
    borderRadius: 20,
    padding: 10,
  },
  calendarContainer: {
    height: 80,
    width: 80,

    borderRadius: 10,
  },
  innerCalendarContainer: {
    paddingHorizontal: "4%",
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
    height: 10,
  },
  daySquare: {
    height: "80%",
    width: 10,
    justifyContent: "center", // Center content inside the square
    alignItems: "center", // Center content inside the square
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default CalendarLights;
