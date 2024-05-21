import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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

  return (
    <View style={styles.container}>
      <ModalDropdown
        options={optionsWithDefault}
        renderButtonText={renderButtonText}
        onSelect={(index, item) => handlePickerChange(index, item)}
        style={styles.dropdown}
        dropdownStyle={styles.dropdownStyle}
        renderRow={(item, index, isSelected) => (
          <View style={styles.dropdownRow}>
            <Text style={styles.dropdownRowText}>{item.name}</Text>
          </View>
        )}
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
  },
  dropdownStyle: {
    width: '80%',
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dropdownRow: {
    padding: 10,
    backgroundColor: 'white',
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
    color: 'white',
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
});

export default SelectMenu;
