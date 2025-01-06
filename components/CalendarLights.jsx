import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import {
  View,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import HelloDayWrapper from "../components/HelloDayWrapper";
import {
  eachMonthOfInterval,
  startOfMonth,
  getDaysInMonth,
  format,
} from "date-fns";

const CalendarLights = ({
  helloesData,
  helloesDataSorted,
  earliestDataPoint,
  latestDataPoint,
  lightUpList,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { width, height } = Dimensions.get("window");
  const [monthsData, setMonthsData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const flatListRef = useRef(null); //to scroll to most recent month, can't find a different way to do it

  useEffect(() => {
    // Scroll to the end without animation when the component mounts
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, []);

  const indexDays = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const getYearData = (year) => {
    const months = eachMonthOfInterval({
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31),
    }).map((date) => {
      return {
        month: format(date, "MMMM"),
        daysInMonth: getDaysInMonth(date),
        startsOn: format(startOfMonth(date), "EEEE"), // Day of the week
      };
    });

    return months;
  };

  const getMonthsInRange = (startMonth, endMonth) => {
    const [startMonthNum, startYear] = startMonth.split("/").map(Number);
    const [endMonthNum, endYear] = endMonth.split("/").map(Number);

    // Set the start and end dates based on the given months
    const startDate = new Date(startYear, startMonthNum - 1, 1); // Start of the given start month
    const endDate = new Date(endYear, endMonthNum - 1, 1); // Start of the given end month
    console.log("END DATE", endDate);
    // Generate all months in the interval
    const months = eachMonthOfInterval({
      start: startDate,
      end: endDate,
    }).map((date) => {
      return {
        month: format(date, "MMMM"), // Full month name
        year: format(date, "yyyy"), // Year
        daysInMonth: getDaysInMonth(date), // Total days in the month
        startsOn: format(startOfMonth(date), "EEEE"), // Day of the week the month starts on
        monthYear: format(date, "M/yyyy"), // Month/Year in M/yyyy format
      };
    });

    return months;
  };

  //automatically set to current year on mount
  useLayoutEffect(() => {
    console.log("LATEST", latestDataPoint);
    setMonthsData(getMonthsInRange(earliestDataPoint, latestDataPoint));

    //setMonthsData(getYearData(currentYear));
  }, []);

  // useEffect(() => {
  // if (monthsData) {
  // console.log(monthsData);
  // }
  //}, [monthsData]);

  const renderDay = (item, lightUp, rowStart, weekData, key) => {
    //console.log(item);

    if (!item) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            { backgroundColor: "transparent", opacity: 0 },
          ]}
          // key={`day-${rowStart }`}
        ></View>
      );
    }

    if (!lightUp) {
      return (
        <View
          key={key}
          style={[styles.daySquare, { backgroundColor: "transparent" }]}
          // key={`day-${rowStart + index}`}
        ></View>
      );
    }
    if (lightUp) {
      console.log("yes", item);
      return (
        <Animated.View
          key={key}
          style={{ height: 10, width: 10, overflow: "hidden" }}
        >
          <HelloDayWrapper isVisible={lightUp}>
            <Animated.View
              style={[styles.daySquare, { backgroundColor: "orange" }]}
              // key={`day-${rowStart + index}`}
            ></Animated.View>
          </HelloDayWrapper>
        </Animated.View>
      );
    }
  };
  const renderWeeks = (totalDays, startingIndex, highlightDays = []) => {
    // Generate the days of the month with filler days
    const allDays = [];

    // Add previous month's filler days
    for (let i = 0; i < startingIndex; i++) {
      allDays.push(null);
    }

    // Add current month's days
    for (let day = 1; day <= totalDays; day++) {
      allDays.push(day);
    }

    // Add next month's filler days
    while (allDays.length % 7 !== 0) {
      allDays.push(null);
    }

    // Number of rows
    const numberOfRows = allDays.length / 7;

    return (
      <View>
        {Array.from({ length: numberOfRows }, (_, rowIndex) => {
          const rowStart = rowIndex * 7;
          const rowEnd = rowStart + 7;

          const weekData = allDays.slice(rowStart, rowEnd);
          //console.log('WEEK DATA', weekData); // Debugging output

          return (
            <View style={styles.weekRow} key={`week-${rowIndex}`}>
              {weekData.map((day, index) => {
                const isHighlighted =
                  day !== null && highlightDays.includes(day);

                return renderDay(
                  day,
                  isHighlighted,
                  rowStart,
                  weekData,
                  `day-${rowStart + index}`
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  //<Text>{item}</Text>
  //break down into months, then pass lightup days into month component
  //render each month block + lightup list in the main flatlist

  const renderCalendarMonth = ({ item }) => {
    const indexRangeStart = indexDays[item.monthData.startsOn];
    const indexRangeTotal = item.monthData.daysInMonth - 1 + indexRangeStart;
    //console.log(indexRangeStart);
    // console.log(indexRangeTotal);

    return (
      <View style={styles.calendarContainer}>
        <Text>{item.monthData.month}</Text>
        <View style={styles.innerCalendarContainer}>
          {renderWeeks(
            item.monthData.daysInMonth,
            indexRangeStart,
            item.helloData.days
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    //console.log(`helloes data sorted`, helloesDataSorted);
    //console.log('months data', monthsData);
    if (monthsData && helloesDataSorted) {
      // Reverse the monthsData to start from December and add correct indices

      // Combine months and helloesData by matching their indices
      const combined = monthsData.map((month) => {
        // Match by index

        //POTENTIAL CAUSE OF CRASH
        // IF IT RETURNS A NULL IT WILL BREAK THE WHOLE COMPONENT SO NEED TO CHANGE THIS
        const helloData =
          helloesDataSorted.find(
            (hello) => hello.monthYear === month.monthYear
          ) || null; // If no match, set to null

        return {
          monthData: month,
          helloData, // Add matched hello data
        };
      });

      setCombinedData(combined);
      //console.log(combined);

      // console.log("Combined Data:", combined);
      // combined.forEach((item, index) => {
      //   console.log(`Hello Data for Month Index ${index}:`, item.helloData.days);
      // });
      //  console.log(combined.map(item => item.helloData.days));
    }
  }, [monthsData, helloesDataSorted]);

  return (
    <View style={[styles.container]}>
      {combinedData && (
        <FlatList
          ref={flatListRef}
          data={combinedData}
          horizontal
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
    height: "auto", 
  },
  calendarContainer: {
    height: 80,
    width: 80,

    backgroundColor: "transparent",
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
