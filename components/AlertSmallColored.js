// AlertSmallColored.js

import React from 'react';
import { TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

const AlertSmallColored = ({ isVisible, toggleModal, position, modalContent }) => {
  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={[styles.modalContainer, { top: position.top - 50, left: position.left - 75 }]}>
        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
          <FontAwesome5 name="times" size={20} color="#555" solid={false} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <FontAwesome5 name="trash" size={20} color="#FF0000" solid={false} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
  },
});

export default AlertSmallColored;
