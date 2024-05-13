import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SelectMenu = ({ options, onSelect, text }) => {
  // Add an extra item at the beginning of the options array
  const optionsWithDefault = [{ id: -1, name: text }, ...options];
  const [selectedOption, setSelectedOption] = useState(-1); // Set default selected value to -1

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedOption(itemValue);
          onSelect(options.find(option => option.id === itemValue));
        }}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        mode="dropdown" // Set the mode to dropdown
      >
        {optionsWithDefault.map(option => (
          <Picker.Item key={option.id} label={option.name} value={option.id} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  picker: {
    width: 120, // Adjust width as needed
    backgroundColor: 'white',
    borderRadius: 10,
  },
  pickerItem: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default SelectMenu;
