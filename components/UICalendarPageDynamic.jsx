import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CalendarBlankSvg from '../assets/svgs/calendar-blank.svg'; // Import the SVG

const UICalendarPageDynamic = ({ numberDate = '30', month = 'JUN', showMonth = true, monthIsHeader = false, width = 40, height = 40, color = '#000000' }) => {
  const calculateFontSize = (width) => {
    return width * 0.4; 
  };

  const calculateDateContainerDimensions = (width, height) => {
    return {
      width: width * 1, 
      height: height * 0.7, 
    };
  };

  const calculateLeftPadding = (svgWidth) => {
    return svgWidth * 0.0;
  };

  const dateContainerDimensions = calculateDateContainerDimensions(width, height);

  return (
    <View style={styles.componentContainer}>
      <View style={[styles.relativeContainer, { width, height }]}>
        <CalendarBlankSvg width={width} height={height} style={[styles.svgImage, { color: color }]} />
        <View style={[styles.dateContainer, dateContainerDimensions, { paddingLeft: calculateLeftPadding(dateContainerDimensions.width) }]}>
          <Text style={[styles.numberDateText, { color: color, fontFamily: 'Poppins-Bold', fontSize: calculateFontSize(width), top: dateContainerDimensions.height * 0.5 }]}>{numberDate}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  relativeContainer: {
    position: 'relative',
  },
  dateContainer: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
  },
  numberDateText: { 
    
},
  monthContainer: {
    // Add any necessary styles for the month container
  },
  monthText: {
    // Add any necessary styles for the month text
  },
});

export default UICalendarPageDynamic;
