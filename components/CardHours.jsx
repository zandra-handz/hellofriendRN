// components/CardHours.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CardHours = ({ hours }) => {
  const [showAllHours, setShowAllHours] = useState(false);

  const removeZeroMinutes = (time) => {
    return time.replace(':00', '');
  };
  
  const getCurrentDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayIndex = new Date().getDay();
    return days[currentDayIndex];
  };

  const currentDay = getCurrentDay();

  const toggleHoursView = () => {
    setShowAllHours(!showAllHours);
  };

  const getTodayHours = () => {
    return hours.find(hour => hour.startsWith(currentDay));
  };

  const todayHours = getTodayHours();
  const [todayDay, todayTime] = todayHours.split(': ');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hours</Text>
      {showAllHours ? (
        hours.map((hour, index) => {
          const [day, time] = hour.split(': ');

          const isToday = day.startsWith(currentDay);
          return (
            <View key={index} style={[styles.hourRow, isToday && styles.currentDayRow]}>
            <Text style={[styles.day, isToday && styles.currentDayText]}>
            {day.substring(0, 3)}:
            </Text>
            <Text style={[styles.time, isToday && styles.currentDayText]}>{time.replace(/:00/g, '')}</Text>
                       
            </View>
          );
        })
      ) : (
        todayHours && (
          <View style={[styles.hourRow, styles.currentDayRow]}> 
            <Text style={[styles.time, styles.currentDayText]}>{todayTime.replace(/:00/g, '')}</Text>
          
          </View>
        )
      )}
      <TouchableOpacity onPress={toggleHoursView}>
        <Text style={styles.toggleText}>{showAllHours ? 'Back' : 'See all'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8, // Reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  title: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  currentDayRow: {
    backgroundColor: '#d4edda',
    borderRadius: 4,
    padding: 4,
  },
  day: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
  currentDayText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
  },
  time: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
  },
  toggleText: {
    fontSize: 14, // Reduced font size
    color: '#00796b',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CardHours;
