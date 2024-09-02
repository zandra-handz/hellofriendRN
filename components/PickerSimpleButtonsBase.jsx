import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PickerSimpleButtonsBase = ({ name, selectedOption, options, onValueChange, isScrollable = false, defaultOption }) => {
  // Local state to manage the currently selected option
  const [currentSelection, setCurrentSelection] = useState(selectedOption);

  // Update the current selection if defaultOption changes
  useEffect(() => {
    if (defaultOption && options.includes(defaultOption)) {
      setCurrentSelection(defaultOption);
    }
  }, [defaultOption, options]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select {name}</Text>
      {isScrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                currentSelection === option && styles.selectedButton
              ]}
              onPress={() => {
                setCurrentSelection(option);
                onValueChange(option);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  currentSelection === option && styles.selectedButtonText
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.buttonsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                currentSelection === option && styles.selectedButton
              ]}
              onPress={() => {
                setCurrentSelection(option);
                onValueChange(option);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  currentSelection === option && styles.selectedButtonText
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Poppins-Bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  scrollViewContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // Ensure buttons have a minimum width
  },
  selectedButton: {
    backgroundColor: '#d4edda',
  },
  buttonText: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Poppins-Bold',
  },
  selectedButtonText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },
});

export default PickerSimpleButtonsBase;
