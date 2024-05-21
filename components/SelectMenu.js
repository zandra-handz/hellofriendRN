import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SelectMenu = ({ options, onSelect, text, showLabel = true, interfaceType = 'dropdown' }) => {
  const optionsWithDefault = [{ id: -1, name: text }, ...options];
  const [selectedOption, setSelectedOption] = useState(-1);

  const handlePickerChange = (itemValue, itemIndex) => {
    setSelectedOption(itemValue);
    onSelect(options.find(option => option.id === itemValue));
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={handlePickerChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode={showLabel ? 'dialog' : 'dropdown'}
        >
          {optionsWithDefault.map(option => (
            <Picker.Item key={option.id} label={option.name} value={option.id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'hotpink',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: 'white',
  },
  pickerItem: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});

export default SelectMenu;