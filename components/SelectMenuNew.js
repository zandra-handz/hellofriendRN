import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';

const SelectMenu = ({ options, onSelect, text }) => {
  const optionsWithDefault = [{ id: -1, name: text }, ...options];
  const [selectedOption, setSelectedOption] = useState(-1);

  const handlePickerChange = (index, item) => {
    const itemValue = item.id;
    setSelectedOption(itemValue);
    onSelect(optionsWithDefault.find(option => option.id === itemValue));
  };

  const renderButtonText = (item) => {
    return item.name;
  };

  const selectedText = optionsWithDefault.find(option => option.id === selectedOption)?.name || text;

  const renderItem = (item, index, isSelected) => (
    <TouchableOpacity onPress={() => handlePickerChange(index, item)}>
      <View style={styles.dropdownRow}>
        <Text style={styles.dropdownRowText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ModalDropdown
        options={optionsWithDefault}
        renderButtonText={renderButtonText}
        onSelect={(index, item) => handlePickerChange(index, item)}
        style={styles.dropdown}
        dropdownStyle={styles.dropdownStyle}
        renderRow={renderItem} // Corrected rendering function
      >
        <View style={styles.customButton}>
          <Text style={styles.buttonText}>{selectedText}</Text>
          <Icon name="chevron-down" size={20} color="white" style={styles.icon} />
        </View>
      </ModalDropdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    position: 'relative',
  },
  dropdown: {
    width: '100%',
    borderRadius: 25,
    width: 40,
    height: 40,
    marginBottom: 0,
    padding: 0,
  },
  dropdownStyle: {
    width: '60%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    height: '70%',
    shadowColor: '#000',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  dropdownRow: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 0,
    color: 'white',
  },
  dropdownRowText: {
    fontSize: 16,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'hotpink',
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'transparent',
    fontSize: 16,
  },
  icon: {
    marginRight: 0,
    marginLeft: -15,
  },
});

export default SelectMenu;
