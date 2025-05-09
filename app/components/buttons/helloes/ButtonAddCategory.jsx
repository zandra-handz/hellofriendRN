import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
 
import AlertSingleInput from '../../alerts/AlertSingleInput';  
 
import AddOutlineSvg from '@/app/assets/svgs/add-outline.svg';


const ButtonAddCategory = ({ title = '', onInputValueChange, height=30, width=30, color="white" }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = (inputValue) => {
   // console.log('Input value from modal:', inputValue);
    if (onInputValueChange) {
      onInputValueChange(inputValue);
    }
    toggleModal();  
  };

  const handleCancel = () => {
  //  console.log('Modal canceled');
    toggleModal();  
  };

  return (
    <>
      <View> 
        <TouchableOpacity onPress={toggleModal}>
            <AddOutlineSvg height={height} width={width} color={color} />

        </TouchableOpacity>

        <AlertSingleInput
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          questionText="Enter new category:"
          confirmText="Save moment"
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

export default ButtonAddCategory;
