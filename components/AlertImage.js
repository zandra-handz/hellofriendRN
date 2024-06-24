import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

const AlertImage = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="black" solid={false} />
          </TouchableOpacity>
          {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
          {modalContent}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '50%',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: '60%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute', 
    top:22,
    right: 22,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 0,
    textAlign: 'left',
  },
});

export default AlertImage;
