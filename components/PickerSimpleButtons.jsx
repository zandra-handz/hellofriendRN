import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PickerSimpleButtons = ({ name, selectedOption, options, onValueChange, isScrollable = false }) => {
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
                selectedOption === option && styles.selectedButton
              ]}
              onPress={() => onValueChange(option)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedOption === option && styles.selectedButtonText
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
                selectedOption === option && styles.selectedButton
              ]}
              onPress={() => onValueChange(option)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedOption === option && styles.selectedButtonText
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
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Poppins-Bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollViewContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80, // Ensure buttons have a minimum width
  },
  selectedButton: {
    backgroundColor: '#ddd', // or any other selected color
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  selectedButtonText: {
    color: '#000', // Change text color if needed when selected
  },
});

export default PickerSimpleButtons;
