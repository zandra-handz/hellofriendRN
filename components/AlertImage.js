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
    justifyContent: 'flex-end',
    alignItems: 'center', 
    height: '100%',
    zIndex: 1,
  },
  modalContent: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: '85%',
    bottom: 0,
    position: 'relative',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute', 
    top:16,
    right: 22,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'left',
  },
});

export default AlertImage;
