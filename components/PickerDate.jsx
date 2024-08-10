import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

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
  containerStyle,
  labelStyle,
  buttonStyle,
  includeContainer = false,
  inline =false, // New prop to control layout
}) => {
  return (
    <View
      style={[
        includeContainer ? [styles.locationContainer, containerStyle] : undefined,
        inline && styles.inlineContainer, // Apply inline styles if `inline` is true
      ]}
    >
      <View style={inline ? styles.inlineContent : undefined}>
        <Text style={[styles.locationTitle, labelStyle]}>
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
    flexDirection: 'row', // Display items in a row for inline layout
    alignItems: 'center',
  },
  inlineContent: {
    flexDirection: 'row', // Keep content in a row
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    marginRight: 10, // Space between text and button
  },
  datePickerButton: {
    marginVertical: 0,  
    // Default styles for the button
    borderRadius: 20, // Ensure the button has rounded corners
    backgroundColor: 'gray', // Default background color
  },
  flexButton: {
    flex: 1, // Make button fill remaining space
    alignItems: 'center',
    justifyContent: 'center',
    
  
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff', // Text color inside the button
    padding: 10,
    borderRadius: 20,
  },
});

export default PickerDate;
