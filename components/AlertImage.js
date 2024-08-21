import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';

import { FontAwesome5 } from 'react-native-vector-icons';
import ArrowBackSharpOutlineSvg from '../assets/svgs/arrow-back-sharp-outline.svg';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons


const AlertImage = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={23} color="black" /> 
            </TouchableOpacity>
            {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
          </View>
          {modalContent}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 0,
    height: '100%',
    position: 'relative',
    bottom: 0,
  },
  header: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    marginBottom: 10, // Space below the header
  },
  closeButton: {
    paddingRight: 30, // Space between button and title
    paddingLeft: 7,
    paddingTop: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'left',
    flex: 1, // Take up remaining space
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
  },
});
 

export default AlertImage;
