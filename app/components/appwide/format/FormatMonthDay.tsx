import React from 'react';
import { Animated, TextStyle } from 'react-native';
import moment from 'moment';

interface FormatMonthDayProps {
  date: string | Date;
  parentStyle?: TextStyle;
}

const FormatMonthDay = ({ date, parentStyle }: FormatMonthDayProps) => {
  const formattedDate = moment(date);
  const currentYear = moment().year();
  const dateYear = formattedDate.year();

  if (!date || !formattedDate.isValid()) {
    return <Animated.Text style={[parentStyle, { fontSize: 13, fontFamily: 'Poppins-Regular' }]} />;
  }

let displayText = formattedDate.format('MMM D');

if (dateYear !== currentYear) {
  displayText += `, ${dateYear}`;
}
 

  return (
    <Animated.Text style={[parentStyle, { fontSize: 13, fontFamily: 'Poppins-Regular' }]}>
      {displayText}
    </Animated.Text>
  );
};

export default FormatMonthDay;


// import React from 'react';
// import { Text, Animated } from 'react-native';
// //import Animated from 'react-native-reanimated';
// import moment from 'moment';  
// import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

// const FormatMonthDay = ({
//   date,
//   fontSize = 13,  
//   monthAbr = true,
//   dayAsNumber = true,
//   dayAsWord = false,
//   dayAsWordAbv = false, 
//   noOutputIfCurrentYear = true,
//   yearAsTimePassed = false,
//   commas = false,
//   fontFamily = 'Poppins-Regular',
//   parentStyle,
//   opacity,
// }) => {
//   const { themeStyles } = useGlobalStyle();

//   if (!date) return <Text style={[parentStyle, {fontFamily: fontFamily, fontSize: fontSize}]}></Text>;
 
//   const formattedDate = moment(date);
//   const currentYear = moment().year();
//   const dateYear = formattedDate.year();
 
//   if (!formattedDate.isValid()) return <Text style={[parentStyle, {fontFamily: fontFamily, fontSize: fontSize}]}></Text>;

//   let displayText = '';
//   let shouldAddComma = false;
 
//   if (dayAsWord) {
//     displayText += formattedDate.format('dddd');  
//     shouldAddComma = true;
//   } else if (dayAsWordAbv) {
//     displayText += formattedDate.format('ddd'); 
//     shouldAddComma = true;
//   }
  
//     if (displayText) {
//       if (shouldAddComma) displayText += ', ';
 
//       }
//     displayText += monthAbr
//       ? formattedDate.format('MMM')  
//       : formattedDate.format('MMMM');  
//     shouldAddComma = true;  
  

  
//     if (displayText) displayText += ' ';  
//     displayText += formattedDate.format('D');  
//     shouldAddComma = true;  
 
 
//     if (noOutputIfCurrentYear && dateYear === currentYear) {

//     } else {
//       if (displayText && dayAsNumber) {
//         if (shouldAddComma) displayText += ', ';  
//     } else {
//         if (shouldAddComma) displayText += ' ';
//       }
//       const yearsPassed = moment().diff(formattedDate, 'years');
//       displayText += yearAsTimePassed
//         ? (commas ? addCommas(yearsPassed) : yearsPassed) + ' year' + (yearsPassed > 1 ? 's' : '') + ' ago'
//         : (commas ? addCommas(dateYear) : dateYear);  
//     } 
 
//   return ( 
//       <Animated.Text style={[parentStyle, {opacity: opacity}]}>{displayText}</Animated.Text>
//   );
// };

 
// const addCommas = (number) => { 
//   if (number < 1000) return number.toString();
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// };
 

// export default FormatMonthDay;
