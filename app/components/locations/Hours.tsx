import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useLocationHours from "@/src/hooks/useLocationHours";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";


// need to wrap this component in {additionalDetails?.hours?.weekday_text && (
const Hours = ({
  buttonHightlightColor,
  onDaySelect,
  currentDay,
  daysHrsData,
  initiallySelectedDay, 
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { fullDays, daysOfWeek, hoursForAllDays, hoursForAllDaysNiceString } =
    useLocationHours(daysHrsData);
  const [selectedDay, setSelectedDay] = useState(initiallySelectedDay); // Change to null to handle "All Days"

  const currentDayIndex = daysOfWeek.findIndex((day) => day === currentDay);
 

  const pluralFullDayCurrent =
    currentDayIndex === 0 ? "" : `${fullDays[currentDayIndex]}s`;
  const hoursForDayCurrent =
    currentDayIndex === 0
      ? hoursForAllDaysNiceString
      : hoursForAllDays[daysOfWeek[currentDayIndex]];

  useFocusEffect(
    useCallback(() => {
      if (
        currentDayIndex &&
        pluralFullDayCurrent &&
        hoursForDayCurrent &&
        !initiallySelectedDay
      ) {
        // const index = daysOfWeek.findIndex((day) => day === currentDay);
        // handleDayPress(currentDayIndex);
        setSelectedDay(currentDayIndex);
        onDaySelect(currentDayIndex, pluralFullDayCurrent, hoursForDayCurrent);
      }
    }, [
      currentDayIndex,
      pluralFullDayCurrent,
      hoursForDayCurrent,
      initiallySelectedDay,
      daysOfWeek,
      handleDayPress,
    ])
  );

  const handleDayPress = useCallback(


    (dayIndex) => {

       console.log(dayIndex);
      if (dayIndex === 0) {
        setSelectedDay(null);
      } else {
        setSelectedDay(dayIndex);
      }
      const selectedDay = dayIndex;
      const pluralFullDay = dayIndex === 0 ? "" : `${fullDays[selectedDay]}s`;

      const hoursForDay =
        dayIndex === 0
          ? hoursForAllDaysNiceString
          : hoursForAllDays[daysOfWeek[dayIndex]];
      onDaySelect(dayIndex, pluralFullDay, hoursForDay);
    },
    [hoursForAllDays, fullDays, daysOfWeek, hoursForAllDaysNiceString]
  );


  useEffect(() => {
  if (currentDay && !initiallySelectedDay) {
    const index = daysOfWeek.findIndex((day) => day === currentDay);
    handleDayPress(index);
  }
}, [currentDay, initiallySelectedDay]);

//this was causing a state set during render/the error message about parent screen location send not being able to render via this trigger because it was happening during render
  // useMemo(() => {
  //   if (currentDay && !initiallySelectedDay) {
  //     // console.log(`CURRENT DAY`, currentDay);
  //     const index = daysOfWeek.findIndex((day) => day === currentDay);
  //     handleDayPress(index);
  //     return;
  //   }
  // }, [currentDay, initiallySelectedDay]);

  const renderHours = () => {
    if (selectedDay === null) {
      return (
        <View style={[styles.hoursContainer, {alignItems: 'start'}]}>
          {Object.entries(hoursForAllDays).map(([day, time], index) => (
            <Text
              key={index}
              style={[styles.hoursText, themeStyles.genericText]}
            >
              {day}: {time}
            </Text>
          ))}
        </View>
      );
    } else {
      const selectedDayName = daysOfWeek[selectedDay];
      return (
        <View style={styles.hoursContainer}>
          <View style={{flexDirection: 'row', paddingVertical: 10, justifyContent: 'start', width: '100%'}}>
            
                    <Text style={[appFontStyles.welcomeText, themeStyles.primaryText]}>
            {fullDays && fullDays[selectedDay]}
          </Text>
          
          </View>
            <View style={{flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', width: '100%'}}>
          <Text style={[appFontStyles.welcomeText, themeStyles.primaryText]}>
            {hoursForAllDays[selectedDayName]}
          </Text>
          
              
            </View>
        </View>
      );
    }
  };

  const renderDayButton = useCallback(
    ({ item, index }) => (
      <Pressable
        key={index}
        style={[
          styles.dayButton,
          selectedDay === index && styles.selectedDayButton,
          {backgroundColor: selectedDay === index ? buttonHightlightColor : 'transparent'

          } 
        ]}
        onPress={() => handleDayPress(index)}
      >
        <Text
          style={[
            styles.dayText,
            themeStyles.genericText,
            selectedDay === index && styles.selectedDayText,
          ]}
        >
          {item}
        </Text>
      </Pressable>
    ),
    [styles, handleDayPress, themeStyles, selectedDay]
  );

  return (
    <View
      style={[
        styles.container,
        themeStyles.genericTextBackground,
        { flexShrink: 1 },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
          alignItems: "center",
        }}
      >
        <View
          style={{
                paddingVertical: 10, 
            flexDirection: "row",
            height: "100%",
            alignItems: "center", 
            justifyContent: 'space-between', 
            height: 'auto',
        
          
          }}
        >
          <Text
            style={[
              styles.title,
              themeStyles.primaryText,
              // appFontStyles.welcomeText,
            ]}
          >
            {/* Hours */}
            Switch
            {/* {fullDays[selectedDay]} */}
          </Text>
          <View
            style={{
              
              marginHorizontal: 10,
              height: "100%",
              width: "100%",
              alignItems: "center",  
            }}
          >
            <FlatList
            contentContainerStyle={{height: '100%', alignItems: 'center' }} // need alignItems here to put this in the center and align with 'Hours' text that shares the flex row with it
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={daysOfWeek}
              renderItem={renderDayButton}
              ListFooterComponent={<View style={{ width: 300 }}></View>}
            />
          </View>
        </View>
      </View>
 
      {renderHours()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    alignSelf: "center",
    paddingVertical: 10,
    width: "100%",
  },
  daysContainer: {
    paddingVertical: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    borderWidth: 0.8,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 4,
    width: 60,
    height: 40,
  },
  selectedDayButton: {},
  dayText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedDayText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  hoursContainer: {
    height: "auto",
    width: "100%",
    alignItems: 'center',
    //  alignItems: "center",
  },
  hoursText: {
    fontSize: 15,
  },
});

export default Hours;
