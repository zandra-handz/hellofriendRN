import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';


const LocationDayAndHrsSelector = ({ onDaySelect, daysHrsData, initiallySelectedDay, borderRadius=20 }) => {
  const { themeStyles } = useGlobalStyle();
  const [selectedDay, setSelectedDay] = useState(initiallySelectedDay); // Change to null to handle "All Days"
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [fullDaysOfWeek, setFullDaysOfWeek] = useState([]); // New state for full day names
  const [hours, setHours] = useState([]);
 

  useLayoutEffect(() => {
    if (daysHrsData) {
      console.log(daysHrsData);
      const abbreviatedDays = daysHrsData.map(entry => entry.slice(0, 3));
      const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Full day names
      const pluralFullDays = fullDays.map(day => day + 's'); // Convert to plural

      setDaysOfWeek(abbreviatedDays);
      setFullDaysOfWeek(pluralFullDays);
      setHours(daysHrsData);
    } else {
      setDaysOfWeek([]);
      setFullDaysOfWeek([]);
      setHours([]);
    }
  }, []);

  useEffect(() => {  
    if (onDaySelect) { 
      const fullDay = selectedDay === null ? 'All Days' : fullDaysOfWeek[selectedDay];
      const hoursForDay = selectedDay === null ? getHoursForAllDays() : getHoursForDay(selectedDay);
      onDaySelect(fullDay, hoursForDay);  
    }
  }, [selectedDay]);

  const removeZeroMinutes = (time) => {
    return time.replace(':00', '');
  };

  const getHoursForDay = (dayIndex) => {
    if (dayIndex >= 0 && dayIndex < hours.length) {
      const hoursString = hours[dayIndex];
      const timeStartIndex = hoursString.indexOf(':') + 1;  
      return timeStartIndex > 0 ? hoursString.slice(timeStartIndex).trim() : 'Closed'; // Slice from the colon to end and trim
    }
    return 'Closed';
  };

  const getHoursForAllDays = () => {
    return hours.map((entry, index) => (
      `${daysOfWeek[index]}: ${removeZeroMinutes(entry.slice(entry.indexOf(':') + 1))}`
    ));
  };

  const handleDayPress = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const handleAllDaysPress = () => {
    setSelectedDay(null);  
  };

  return (
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo, {borderRadius: borderRadius}]}>
      <View style={styles.daysContainer}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            selectedDay === null && styles.selectedDayButton
          ]}
          onPress={handleAllDaysPress}
        >
          <Text
            style={[
              styles.dayText,
              themeStyles.genericText,
              selectedDay === null && styles.selectedDayText
            ]}
          >
            All Days
          </Text>
        </TouchableOpacity>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
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
                selectedDay === index && styles.selectedDayText
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.hoursContainer}>
        {selectedDay === null ? (
          getHoursForAllDays().map((entry, index) => (
            <Text key={index} style={[styles.hoursText, themeStyles.genericText]}>
              {entry}
            </Text>
          ))
        ) : (
          <Text style={[styles.hoursText, themeStyles.genericText]}>
            {removeZeroMinutes(getHoursForDay(selectedDay))}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  
    paddingHorizontal: '2%', 
    paddingVertical: '3%',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  dayButton: {
    padding: 2,
    paddingHorizontal: '1%',
    borderRadius: 10,
  },
  selectedDayButton: {  
    borderWidth: .8, 
    borderRadius: 30,
    paddingHorizontal: '3%',
    paddingVertical: '1%',
  },
  dayText: { 
    fontSize: 15,
  },
  selectedDayText: { 
    fontWeight: 'bold',
    fontSize: 15,
  },
  hoursContainer: {
    paddingVertical: '4%',
    alignItems: 'center',
  },
  hoursText: { 
    fontSize: 14,
  },
});

export default LocationDayAndHrsSelector;
