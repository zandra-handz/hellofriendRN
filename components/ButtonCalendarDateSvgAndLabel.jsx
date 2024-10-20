import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UICalendarPageDynamic from './UICalendarPageDynamic'; // Import the calendar component

const ButtonCalendarDateSvgAndLabel = ({ 
  numberDate = '30', 
  month = 'JUN', 
  showMonth = true, 
  label = '',
  showLabel = true,
  containerHeight=50,
  onPress, 
  width = 60, 
  height = 60, 
  color = '#000000', 
  enabled = true // New prop to control if the button is enabled or disabled
}) => {
  return (
    <View style={[styles.container, {height: height}]}>
      
    <TouchableOpacity
      onPress={enabled ? onPress : null}
      style={[styles.calendarButton, !enabled && styles.disabledButton]}
      disabled={!enabled} // Ensure button is disabled visually and functionally
    >

      <View style={[styles.svgContainer, { width, containerHeight }]}>
        <UICalendarPageDynamic
          numberDate={numberDate}
          month={month}
          showMonth={showMonth} // Hide the month inside the SVG if showMonth is true
          width={width}
          height={height}
          color={color}
        />
      </View>
      {showMonth && (
            <Text 
                style={[styles.monthText, { color: color, position: 'absolute', top: -20 }]}
                numberOfLines={1} // Ensures the text is only one line
                ellipsizeMode='tail' // Adds an ellipsis at the end if the text is too long
              >
            {month}
          </Text>
        )}
              <View style={styles.textContainer}>

        {showLabel && (
          <Text 
            style={[styles.text, { color: color, position: 'absolute', top: 30 }]}
            numberOfLines={1} // Ensures the text is only one line
            ellipsizeMode='tail' // Adds an ellipsis at the end if the text is too long
          >
            {label}
          </Text>
        )}
        </View>
    </TouchableOpacity>
    
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%',
    flexDirection: 'column'


  },
  calendarButton: {
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius: 8,
    paddingHorizontal: '3%',
  },
  disabledButton: {
    opacity: 0.5, // Change appearance when disabled
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  monthText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ButtonCalendarDateSvgAndLabel;
