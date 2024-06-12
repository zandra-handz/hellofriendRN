import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ButtonAddress = ({ address, onDelete }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAddressVisible, setIsAddressVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleAddressPopup = () => {
    setIsAddressVisible(!isAddressVisible);
    setIsMenuVisible(false); // Ensure the menu is closed when the modal is closed
  };

  const handleDelete = () => {
    onDelete(address.title);
    toggleMenu();
  };

  const handleCloseModal = () => {
    setIsAddressVisible(false);
    setIsMenuVisible(false); // Ensure the menu is closed when the modal is closed
  };

  return (
    <TouchableOpacity style={styles.button} onPress={toggleAddressPopup}>
      <Text style={styles.text}>{address.title}</Text>
      <Modal transparent={true} visible={isAddressVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="black" solid={false} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{address.title}</Text>
            <Text style={styles.addressText}>{address.address}</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.threeDotsButton}>
              <FontAwesome5 name="ellipsis-v" size={20} color="black" />
            </TouchableOpacity>
            {isMenuVisible && (
              <View style={styles.menu}>
                <TouchableOpacity onPress={handleDelete}>
                  <FontAwesome5 name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#000',
    marginRight: 5,
  },
  menu: {
    position: 'absolute',
    bottom: -50,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    position: 'relative',
  },
  addressText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    right: 22,
    zIndex: 1,
  },
  threeDotsButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 0,
    textAlign: 'left',
  },
});

export default ButtonAddress;