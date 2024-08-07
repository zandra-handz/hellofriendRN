import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertSingleInput from './AlertSingleInput'; // Adjust the import path as needed

const ButtonSingleInput = ({ title, onInputValueChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = (inputValue) => {
    console.log('Input value from modal:', inputValue);
    if (onInputValueChange) {
      onInputValueChange(inputValue); // Pass the input value up to the parent
    }
    toggleModal(); // Close the modal
  };

  const handleCancel = () => {
    console.log('Modal canceled');
    toggleModal(); // Close the modal
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal} style={[styles.editButton, { width: title ? 'auto' : 40 }]}>
        {title && <Text style={styles.buttonText}>{title}</Text>}
        {!title && <FontAwesome5 name="plus" size={12} color="white" />}
      </TouchableOpacity>

      <AlertSingleInput
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        questionText="Please enter your input:"
        confirmText="Submit"
        cancelText="Cancel"
        onInputChange={(value) => console.log('Input value changed:', value)} // Optional: Handle input change if needed
      />
    </>
  );
};

const styles = StyleSheet.create({
  editButton: {
    marginLeft: 3,
    borderRadius: 15,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Align text and icon horizontally
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'white',
    marginRight: 5, // Space between the text and the icon
  },
});

export default ButtonSingleInput;