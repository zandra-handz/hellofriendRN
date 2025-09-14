import React from 'react'; 
import DateTimePicker from '@react-native-community/datetimepicker';
 

const PickerDate = ({

 
  value,
  mode, 
  display, 
  onChange,
  showDatePicker, 
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

export default PickerDate;
