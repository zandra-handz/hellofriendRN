import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const PickerDate = ({
  value,
  mode,
  containerText = 'Last time you said hello?',
  display,
  maximumDate,
  onChange,
  showDatePicker,
  setShowDatePicker,
  dateTextStyle, 
  buttonStyle,
  includeContainer = false,
  inline =false,  
}) => {
  
  const { themeStyles } = useGlobalStyle();
  
  return (
    <View
      style={[
        includeContainer ? [styles.locationContainer] : undefined,
        inline && styles.inlineContainer,  
      ]}
    >
      <View style={inline ? styles.inlineContent : undefined}>
        <Text style={[styles.locationTitle, themeStyles.subHeaderText]}>
          {containerText}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.datePickerButton, buttonStyle, inline && styles.flexButton]}
        >
          <Text style={[styles.dateText, dateTextStyle]}>
            {moment(value).format('MMMM Do YYYY')}
          </Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={mode}
          display={display}
          maximumDate={maximumDate}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  inlineContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  inlineContent: {
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    marginRight: 10,  
  },
  datePickerButton: { 
    borderRadius: 20,
    backgroundColor: 'gray',
    padding: 8,
    alignItems: 'center',
    flex: 1,
  },
  flexButton: {
    flex: 1,  
    
  
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#fff',  
  },
});

export default PickerDate;
