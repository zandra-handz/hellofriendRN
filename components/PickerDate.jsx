import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import CalendarAddOutlineSvg from '../assets/svgs/calendar-add-outline.svg';

const PickerDate = ({
  value,
  mode,
  containerText = 'Last time you said hello?',
  display,
  maximumDate,
  onChange,
  showDatePicker,
  setShowDatePicker, 
  includeContainer = false,
  inline =false,  
  buttonHeight='auto',
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
          style={[styles.datePickerButton, themeStyles.genericTextBackgroundShadeTwo, {height: buttonHeight}, inline && styles.flexButton]}
        >
            <View style={{paddingRight: 8}}>
            <CalendarAddOutlineSvg height={30} width={30} color='white' />
            </View>

          <Text style={[styles.dateText]}>
 
            {moment(value).format('MMM D YYYY')}
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
    borderRadius: 8,
    padding: 10,  
    marginVertical: 8,
  },
  inlineContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  inlineContent: {
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%',
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',  
  },
  datePickerButton: { 
    borderRadius: 10,
    width: '100%',
    justifyContent: 'flex-start',
    textAlign: 'center',
    alignContent: 'center', 
    borderRadius: 24,
    padding: 2,
    paddingLeft: 10,  
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
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

    fontFamily: 'Poppins-Regular',
    color: '#fff',  
  },
});

export default PickerDate;
