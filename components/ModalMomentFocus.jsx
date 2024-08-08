// ModalMomentFocus.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ModalMomentFocus = ({ isModalVisible, handleCloseModal, textInput, handleInputChange, placeholderText }) => {
  const { gradientColors } = useGlobalStyle();
  const { darkColor, lightColor } = gradientColors;
  const { selectedFriend, friendDashboardData, friendColorTheme, loadingNewFriend, setFriend } = useSelectedFriend();
  const [friendLightColor, setFriendLightColor] = useState('white');
  const [friendDarkColor, setFriendDarkColor] = useState('white');

  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if(friendColorTheme.invertGradient) {
        setFriendLightColor(friendColorTheme.darkColor || darkColor);
        setFriendDarkColor(friendColorTheme.lightColor || lightColor);
      } else {
        setFriendLightColor(friendColorTheme.lightColor || darkColor);
        setFriendDarkColor(friendColorTheme.darkColor || lightColor);
      };
    }
    if (friendColorTheme && friendColorTheme.useFriendColorTheme == false || !friendColorTheme) {
      setFriendLightColor(lightColor);
      setFriendDarkColor(darkColor);
    

    };
  }, [friendColorTheme]);

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleCloseModal}
      style={styles.modal}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={[friendDarkColor, friendLightColor]} // Gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} // Direction of the gradient
          style={styles.modalContent}
        >
          <TextInput
            style={styles.modalTextInput}
            multiline={true}
            value={textInput}
            onChangeText={handleInputChange}
            placeholder={placeholderText}
            autoFocus={true}
          />
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Minimize</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Remove default margin for full-screen modal
    justifyContent: 'flex-end', // Align modal to the bottom
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: '100%',
    height: '100%', // Full height for the gradient
    padding: 20,
    borderRadius: 0, // No rounded corners
    alignItems: 'center',
  },
  modalTextInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    padding: 10,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'transparent',
    width: '100%', // Full width for text input
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'limegreen',
    borderRadius: 20,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default ModalMomentFocus;
