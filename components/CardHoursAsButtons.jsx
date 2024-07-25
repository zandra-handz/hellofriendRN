import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocationList } from '../context/LocationListContext';

const CardHoursAsButtons = ({ onDaySelect }) => {
  const { additionalDetails } = useLocationList();
  const [selectedDay, setSelectedDay] = useState(null); // Change to null to handle "All Days"
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [fullDaysOfWeek, setFullDaysOfWeek] = useState([]); // New state for full day names
  const [hours, setHours] = useState([]);

  useEffect(() => {
    if (additionalDetails && additionalDetails.hours && additionalDetails.hours.weekday_text) {
      const abbreviatedDays = additionalDetails.hours.weekday_text.map(entry => entry.slice(0, 3));
      const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // Full day names
      const pluralFullDays = fullDays.map(day => day + 's'); // Convert to plural

      setDaysOfWeek(abbreviatedDays);
      setFullDaysOfWeek(pluralFullDays);
      setHours(additionalDetails.hours.weekday_text);
    } else {
      setDaysOfWeek([]);
      setFullDaysOfWeek([]);
      setHours([]);
    }
  }, [additionalDetails]);

  useEffect(() => {
    // Notify parent about the selected day whenever it changes
    if (onDaySelect) {
      const day = selectedDay === null ? 'All Days' : daysOfWeek[selectedDay];
      const fullDay = selectedDay === null ? 'All Days' : fullDaysOfWeek[selectedDay];
      const hoursForDay = selectedDay === null ? getHoursForAllDays() : getHoursForDay(selectedDay);
      onDaySelect(fullDay, hoursForDay); // Pass plural day name to parent
    }
  }, [selectedDay]);

  const removeZeroMinutes = (time) => {
    return time.replace(':00', '');
  };

  const getHoursForDay = (dayIndex) => {
    if (dayIndex >= 0 && dayIndex < hours.length) {
      const hoursString = hours[dayIndex];
      const timeStartIndex = hoursString.indexOf(':') + 1; // Find the index of the colon and move one position right
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
    setSelectedDay(null); // Set to null to show hours for all days
  };

  return (
    <View style={styles.container}>
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
              selectedDay === index && styles.selectedDayButton
            ]}
            onPress={() => handleDayPress(index)}
          >
            <Text
              style={[
                styles.dayText,
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
            <Text key={index} style={styles.hoursText}>
              {entry}
            </Text>
          ))
        ) : (
          <Text style={styles.hoursText}>
            {removeZeroMinutes(getHoursForDay(selectedDay))}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 20,
  },
  selectedDayButton: {
    backgroundColor: '#d4edda',
  },
  dayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  selectedDayText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },
  hoursContainer: {
    alignItems: 'center',
  },
  hoursText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});

export default CardHoursAsButtons;
