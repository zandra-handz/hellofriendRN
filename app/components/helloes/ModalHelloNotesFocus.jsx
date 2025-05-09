import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';  
import { useFriendList } from '@/src/context/FriendListContext';

const ModalHelloNotesFocus = ({ isModalVisible, handleCloseModal, textInput, handleInputChange, placeholderText }) => {
  
  const { themeAheadOfLoading } = useFriendList();
 
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleCloseModal}
      style={styles.modal}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}  
          style={styles.modalContent}
        >
          <TextInput
            style={[styles.modalTextInput, {borderColor: themeAheadOfLoading.darkColor}]}
            multiline={true}
            value={textInput}
            onChangeText={handleInputChange}
            placeholder={placeholderText}
            autoFocus={true}
          />
          <TouchableOpacity onPress={handleCloseModal} style={[styles.closeButton, {backgroundColor: themeAheadOfLoading.darkColor}]}>
            <Text style={[styles.closeButtonText, {color: themeAheadOfLoading.lightColor}]}>Minimize</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
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

export default ModalHelloNotesFocus;
