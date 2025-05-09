import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CardHours = ({ hours }) => {
  const [showAllHours, setShowAllHours] = useState(false);

 
  
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
      <Text style={styles.title}>{showAllHours ? 'Hours' : 'Today'}</Text>
      {showAllHours ? (
        hours.map((hour, index) => {
          const [day, time] = hour.split(': ');

          const isToday = day.startsWith(currentDay);
          return (
            <View key={index} style={[styles.hourRow, isToday && styles.currentDayRow]}>
            <Text style={[styles.day, isToday && styles.currentDayText]}>
            {day.substring(0, 2)}:
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
    padding: 2, // Reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
    width: 94,
  },
  title: {
    fontSize: 14, // Reduced font size
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding: 2,
    marginBottom: 4,
  },
  currentDayRow: {
    backgroundColor: '#d4edda',
    borderRadius: 10,
    padding: 4,
    paddingHorizontal: 10,
  },
  day: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
  },
  currentDayText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
  },
  time: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
  toggleText: {
    fontSize: 11, 
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
});

export default CardHours;
