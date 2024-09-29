import React from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ModalMomentFocus = ({ isModalVisible, handleCloseModal, textInput, handleInputChange, placeholderText }) => {
  const { calculatedThemeColors } = useSelectedFriend();

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleCloseModal}
      style={styles.modal}
      animationIn="slideInRight"    // Animation for sliding in from the right
      animationOut="slideOutRight"  // Animation for sliding out to the right
      useNativeDriver={true}   
    > 
      <LinearGradient
          colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}  
          style={styles.modalContent}
        >
          <TextInput
            style={[styles.modalTextInput, {borderColor: calculatedThemeColors.darkColor}]}
            multiline={true}
            value={textInput}
            onChangeText={handleInputChange}
            placeholder={placeholderText}
            autoFocus={true}
          />
          <TouchableOpacity onPress={handleCloseModal} style={[styles.closeButton, {backgroundColor: calculatedThemeColors.darkColor}]}>
            <Text style={[styles.closeButtonText, {color: calculatedThemeColors.lightColor}]}>Back</Text>
          </TouchableOpacity>
        </LinearGradient> 
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {    
    alignContent: 'center', 
    margin: 0, 
  },
 
  modalContent: { 
    width: '100%',
    height: '100%',   
    alignItems: 'center',
  },
  modalTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    padding: 24,
    textAlignVertical: 'top',
    borderWidth: 1.8,
    borderRadius: 20, 
    width: '100%',
  },
  closeButton: {
    marginTop: 20, 
    borderRadius: 20,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: { 
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default ModalMomentFocus;
