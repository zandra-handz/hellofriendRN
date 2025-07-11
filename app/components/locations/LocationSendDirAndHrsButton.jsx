import React from 'react';
import {  Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';


const LocationSendDirAndHrsButton = ({ 
    onPress,
    dayIndex,
    isNextOpen,
    day,
    time,
    width='100%', 
}) => {

  const { themeStyles } = useGlobalStyle();

  const selectedDay = day; 

  const handlePress = () => {
    onPress(dayIndex);
  };

 
    return ( 
            <TouchableOpacity
                onPress={handlePress}
                 style={[isNextOpen && styles.nextOpenRow, {paddingVertical: '1%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', width: width}]}>

              <Text style={[styles.day, themeStyles.genericText]}>{day}</Text>
              <Text style={[styles.time, themeStyles.genericText]}>{time}</Text>
 
            </TouchableOpacity> 
    )
}



const styles = StyleSheet.create({
 
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20, 
  },
  nextOpenRow: { 
    borderWidth: 2, 
    borderColor: `lightgreen`, 
    backgroundColor: 'transparent', //themeStyles.genericTextBackgroundShadeTwo.backgroundColor, 
    width: 'auto',
    paddingHorizontal: '3%', 
    paddingVertical: '1%', 
    borderRadius: 20,
    justifyContent: 'center',
  },
  day: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 14,
    selfAlign: 'center',
  }, 
  time: { 
    textTransform: 'lowercase',
    fontSize: 14,
  },  
});
  
  export default LocationSendDirAndHrsButton;
  