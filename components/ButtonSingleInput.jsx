import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertSingleInput from './AlertSingleInput';  
import ButtonColorBGSmall from '../components/ButtonColorBGSmall';


const ButtonSingleInput = ({ title = '', onInputValueChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = (inputValue) => {
    console.log('Input value from modal:', inputValue);
    if (onInputValueChange) {
      onInputValueChange(inputValue);
    }
    toggleModal();  
  };

  const handleCancel = () => {
    console.log('Modal canceled');
    toggleModal();  
  };

  return (
    <>
      <View> 
        <ButtonColorBGSmall 
          onPress={toggleModal} 
          title={title.length > 0 ? title : ''} 
          textStyle={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: 'white' }}
        >
          {title.length === 0 && <FontAwesome5 name="plus" size={12} color="white" />} 
        </ButtonColorBGSmall>

        <AlertSingleInput
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          questionText="Enter new category:"
          confirmText="Submit"
          cancelText="Cancel"
          onInputChange={(value) => console.log('Input value changed:', value)} // Optional: Handle input change if needed
          maxLength={50} //max length of Category model on backend as of 9/15/2024
       />
      </View>
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
