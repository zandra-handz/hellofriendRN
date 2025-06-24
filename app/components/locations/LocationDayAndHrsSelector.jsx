import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useLocationHours from "@/src/hooks/useLocationHours";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
const LocationDayAndHrsSelector = ({
  onDaySelect,
  currentDay,
  daysHrsData,
  initiallySelectedDay,
  width = "90%",
  height = "60%",
  borderRadius = 20,
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
        onDaySelect(pluralFullDayCurrent, hoursForDayCurrent);
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
      onDaySelect(pluralFullDay, hoursForDay);
    },
    [hoursForAllDays, daysOfWeek, hoursForAllDaysNiceString]
  );

  useMemo(() => {
    if (currentDay && !initiallySelectedDay) {
      // console.log(`CURRENT DAY`, currentDay);
      const index = daysOfWeek.findIndex((day) => day === currentDay);
      handleDayPress(index);
      return;
    }
  }, [currentDay, initiallySelectedDay]);

  const renderHours = () => {
    if (selectedDay === null) {
      return (
        <View style={styles.hoursContainer}>
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
          <Text style={[styles.hoursText, themeStyles.genericText]}>
            {hoursForAllDays[selectedDayName]}
          </Text>
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
          selectedDay === index && themeStyles.genericTextBackground,
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
        themeStyles.genericTextBackgroundShadeTwo,
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
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text
            style={[
              styles.title,
              themeStyles.primaryText,
              appFontStyles.welcomeText,
            ]}
          >
            Hours
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              height: "100%",
              width: "100%",
              alignItems: "center",
            }}
          >
            <FlatList
              horizontal={true}
              data={daysOfWeek}
              renderItem={renderDayButton}
              ListFooterComponent={<View style={{ width: 300 }}></View>}
            />
          </View>
        </View>
      </View>

      {/* <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => (
          <Pressable
            key={index}
            style={[
              styles.dayButton,
              selectedDay === index && styles.selectedDayButton,
              selectedDay === index && themeStyles.genericTextBackground,
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
              {day}
            </Text>
          </Pressable>
        ))}
      </View> */}
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
    //  alignItems: "center",
  },
  hoursText: {
    fontSize: 14,
  },
});

export default LocationDayAndHrsSelector;
