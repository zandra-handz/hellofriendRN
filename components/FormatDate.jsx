import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'; // Ensure moment.js is installed

const FormatDate = ({
  date,
  fontSize = 14,
  color = 'black',
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

 
  const formattedDate = moment(date);
  const currentYear = moment().year();
  const dateYear = formattedDate.year();
 
  if (!formattedDate.isValid()) return <Text style={styles.text}></Text>;

  let displayText = '';
  let shouldAddComma = false;
 
  if (dayAsWord) {
    displayText += formattedDate.format('dddd'); // Day of the week as a word
    shouldAddComma = true;
  } else if (dayAsWordAbv) {
    displayText += formattedDate.format('ddd'); // Day of the week as an abbreviation
    shouldAddComma = true;
  }
 
  if (month) {
    if (displayText) {
      if (shouldAddComma) displayText += ', ';
 
      }
    displayText += monthAbr
      ? formattedDate.format('MMM')  
      : formattedDate.format('MMMM');  
    shouldAddComma = true;  
  }

 
  if (dayAsNumber) {
    if (displayText) displayText += ' ';  
    displayText += formattedDate.format('D');  
    shouldAddComma = true;  
  }
 
  if (year) {
    if (noOutputIfCurrentYear && dateYear === currentYear) {

    } else {
      if (displayText && dayAsNumber) {
        if (shouldAddComma) displayText += ', ';  
    } else {
        if (shouldAddComma) displayText += ' ';
      }
      const yearsPassed = moment().diff(formattedDate, 'years');
      displayText += yearAsTimePassed
        ? (commas ? addCommas(yearsPassed) : yearsPassed) + ' year' + (yearsPassed > 1 ? 's' : '') + ' ago'
        : (commas ? addCommas(dateYear) : dateYear);  
    }
  }

  if (!month && !dayAsNumber && !dayAsWord && !dayAsWordAbv && !year) {
    displayText = formattedDate.format('YYYY-MM-DD');
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: color, fontSize: fontSize }]}>{displayText}</Text>
    </View>
  );
};

 
const addCommas = (number) => { 
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
  },
});

export default FormatDate;
