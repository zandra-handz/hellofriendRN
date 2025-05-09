import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import CalendarAddOutlineSvg from '@/app/assets/svgs/calendar-add-outline.svg';

const PickerDate = ({
  title='PICK DATE',
  value,
  mode, 
  display,
  maximumDate,
  onChange,
  showDatePicker,
  setShowDatePicker,   
}) => {
  
  const { themeStyles } = useGlobalStyle();
  
  return (
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          //height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.genericText]}>
          {title}
          </Text> 
          </View>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.button,
            themeStyles.genericTextBackgroundShadeTwo,
          ]}
          >
            <View style={{paddingRight: 8}}>
            <CalendarAddOutlineSvg height={30} width={30} color={themeStyles.genericText.color} />
            </View>

          <Text style={[styles.dateText, themeStyles.genericText]}>
 
            {moment(value).format('MMM D YYYY')}
          </Text>
        </TouchableOpacity> 
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
  container: {
    width: "100%", 
    //flex: 1,
    borderRadius: 30,
    //margin: "4%",
    alignSelf: "center",
    padding: 20,
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
