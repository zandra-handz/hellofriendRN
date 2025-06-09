import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Animated,
  FlatList,
  Text, 
  StyleSheet,
} from "react-native"; 
import HelloDayWrapper from "@/app/components/helloes/HelloDayWrapper";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 

const CalendarLights = ({
    
  combinedData,
  daySquareBorderRadius=0, 
  // opacityMinusAnimation=1,
  animationColor='orange',
}) => {  
  // const [combinedData, setCombinedData] = useState([]);
 
  const { themeStyles } = useGlobalStyle();
const daySquareBorderColor = themeStyles.primaryBackground.backgroundColor;
const opacityMinusAnimation = 1;
  const flatListRef = useRef(null);  

  useEffect(() => {
    // Scroll to the end without animation when the component mounts
    // doesn't work!
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
 
 

  const renderDay = (item, lightUp, rowStart, weekData, key) => {
    //console.log(item);

    if (!item) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            {opacity: opacityMinusAnimation, borderRadius: daySquareBorderRadius, borderColor: daySquareBorderColor, backgroundColor: "transparent", opacity: 0 },
          ]}
          // key={`day-${rowStart }`}
        ></View>
      );
    }

    if (!lightUp) {
      return (
        <View
          key={key}
          style={[styles.daySquare, { opacity: opacityMinusAnimation, borderRadius: daySquareBorderRadius, borderColor: daySquareBorderColor, backgroundColor: "transparent" }]}
          // key={`day-${rowStart + index}`}
        ></View>
      );
    }
    if (lightUp) {
      //console.log("yes", item);
      return (
        <Animated.View
          key={key}
          style={{ height: 10, width: 10, overflow: "hidden" }}
        >
          <HelloDayWrapper isVisible={lightUp}>
            <Animated.View
              style={[styles.daySquare, { borderRadius: daySquareBorderRadius, backgroundColor: animationColor}]}
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

  // const renderCalendarMonth = ({ item }) => {
   
  //   const indexRangeStart = indexDays[item.monthData.startsOn];
  //   const indexRangeTotal = item.monthData.daysInMonth - 1 + indexRangeStart;
  
  //   // Ensure helloData exists and has `days`
  //   const highlightDays = item.helloData?.days || [];
  
  //   return (
  //     <View style={styles.calendarContainer}>
  //       <Text
  //         style={{
  //           fontFamily: 'Poppins-Regular',
  //           fontSize: 12,
  //           opacity: opacityMinusAnimation,
  //           color: daySquareBorderColor,
  //         }}
  //       >
  //         {item.monthData.month.slice(0, 3)} {item.monthData.year.slice(0, 4)}
  //       </Text>
  //       <View style={styles.innerCalendarContainer}>
  //         {renderWeeks(item.monthData.daysInMonth, indexRangeStart, highlightDays)}
  //       </View>
  //     </View>
  //   );
  // };


  const renderCalendarMonth = useCallback(({ item }) => {
  const indexRangeStart = indexDays[item.monthData.startsOn];
  const indexRangeTotal = item.monthData.daysInMonth - 1 + indexRangeStart;

  const highlightDays = item.helloData?.days || [];

  return (
    <View style={styles.calendarContainer}>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
          opacity: opacityMinusAnimation,
          color: daySquareBorderColor,
        }}
      >
        {item.monthData.month.slice(0, 3)} {item.monthData.year.slice(0, 4)}
      </Text>
      <View style={styles.innerCalendarContainer}>
        {renderWeeks(item.monthData.daysInMonth, indexRangeStart, highlightDays)}
      </View>
    </View>
  );
}, [
  indexDays,
  opacityMinusAnimation,
  daySquareBorderColor,
  renderWeeks,
  styles.calendarContainer,
  styles.innerCalendarContainer,
]);
  
 
 

  return (
    <View style={[styles.container, {backgroundColor: themeStyles.lighterOverlayBackgroundColor.backgroundColor}]}>
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
