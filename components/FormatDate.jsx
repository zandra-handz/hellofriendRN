import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'; // Ensure moment.js is installed

const FormatDate = ({
  date,
  fontSize = 14,
  month = false,
  monthAbr = false,
  dayAsNumber = false,
  dayAsWord = false,
  dayAsWordAbv = false,
  year = false,
  noOutputIfCurrentYear = false,
  yearAsTimePassed = false,
  commas = false,
}) => {
  if (!date) return <Text style={styles.text}></Text>;

  // Use moment.js to parse and format the date
  const formattedDate = moment(date);
  const currentYear = moment().year();
  const dateYear = formattedDate.year();

  // Check if the date is valid
  if (!formattedDate.isValid()) return <Text style={styles.text}></Text>;

  let displayText = '';
  let shouldAddComma = false;

  // Adding day as word or abbreviation
  if (dayAsWord) {
    displayText += formattedDate.format('dddd'); // Day of the week as a word
    shouldAddComma = true;
  } else if (dayAsWordAbv) {
    displayText += formattedDate.format('ddd'); // Day of the week as an abbreviation
    shouldAddComma = true;
  }

  // Adding month
  if (month) {
    if (displayText) {
      if (shouldAddComma) displayText += ', '; // Add comma only if there is existing content
    }
    displayText += monthAbr
      ? formattedDate.format('MMM') // Three-letter month abbreviation
      : formattedDate.format('MMMM'); // Full month name
    shouldAddComma = true; // Set to true for future comma addition
  }

  // Adding day as number
  if (dayAsNumber) {
    if (displayText) displayText += ' '; // Add comma only if there is existing content
    displayText += formattedDate.format('D'); // Day of the month as a number
    shouldAddComma = true; // Set to true for future comma addition
  }

  // Adding year
  if (year) {
    if (noOutputIfCurrentYear && dateYear === currentYear) {
      // Skip year output if it's the current year
    } else {
      if (displayText && dayAsNumber) {
        if (shouldAddComma) displayText += ', '; // Add comma only if there is existing content
     // this might be sort of dumb bandaid fix of inserting a space between month and year
     } else {
        if (shouldAddComma) displayText += ' ';
      }
      const yearsPassed = moment().diff(formattedDate, 'years');
      displayText += yearAsTimePassed
        ? (commas ? addCommas(yearsPassed) : yearsPassed) + ' year' + (yearsPassed > 1 ? 's' : '') + ' ago'
        : (commas ? addCommas(dateYear) : dateYear); // Year
    }
  }

  if (!month && !dayAsNumber && !dayAsWord && !dayAsWordAbv && !year) {
    // Default format if no other options are set
    displayText = formattedDate.format('YYYY-MM-DD');
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: fontSize }]}>{displayText}</Text>
    </View>
  );
};

// Helper function to add commas to large numbers, but not to years
const addCommas = (number) => {
  // Avoid adding commas to years
  if (number < 1000) return number.toString();
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const styles = StyleSheet.create({
  container: {    
    alignItems: 'center', 
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
});

export default FormatDate;
