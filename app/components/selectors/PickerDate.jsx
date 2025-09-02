import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'; 
import CalendarAddOutlineSvg from '@/app/assets/svgs/calendar-add-outline.svg';
 

const PickerDate = ({

  primaryColor,
  title='',
  value,
  mode, 
  display, 
  onChange,
  showDatePicker,
  setShowDatePicker,   
}) => {
   
  
  return (
    <>
 
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={mode}
          display={display}
          maximumDate={new Date()}
          onChange={onChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", 
    //flex: 1,
    borderRadius: 10,
    //margin: "4%",
    alignSelf: "center",
    padding: 0,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },    
  button: {
    borderRadius: 30,
    alignSelf: "center",
    padding: 0,
    flexDirection:'row',
    width: '100%',
    justifyContent: 'space-between', 
  },
  flexButton: {
    flex: 1,   
  
  },
  dateText: {
    fontSize: 15,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    //fontFamily: 'Poppins-Regular', 
  },
});

export default PickerDate;
