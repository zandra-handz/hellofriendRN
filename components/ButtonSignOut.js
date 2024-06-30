import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthUser } from '../context/AuthUserContext';

const ButtonSignOut = ({ 
  icon = 'sign-out', 
  iconOnly = false, 
  label = 'Sign Out', 
  confirmationAlert = true, 
  ModalComponent, // Accept the modal as a prop
  fAIcon = false // Boolean prop to determine icon type
}) => {
  const { onSignOut } = useAuthUser();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSignOutPress = () => {
    if (confirmationAlert) {
      setModalVisible(true);
    } else {
      onSignOut();
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const confirmSignOut = () => {
    setModalVisible(false);
    onSignOut();
  };

  const renderIcon = () => {
    if (fAIcon) {
      return (
        <FontAwesome 
          name={icon} 
          size={28} 
          color="black" 
          style={styles.icon} 
        />
      );
    } else {
      return (
        <Icon 
          name={icon} 
          size={28} 
          color="black" 
          style={styles.icon} 
        />
      );
    }
  };

  // Default modal component
  const DefaultModal = (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <FontAwesome name="times" size={20} color="black" solid={false} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Confirm Sign Out</Text>
          <View>
            <Text>Are you sure you want to sign out?</Text>
            <TouchableOpacity onPress={confirmSignOut} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <TouchableOpacity onPress={handleSignOutPress} style={styles.buttonContainer}>
        {renderIcon()}
        {!iconOnly && <Text style={styles.label}>{label}</Text>}
      </TouchableOpacity>

      {confirmationAlert && !ModalComponent && DefaultModal}

      {confirmationAlert && ModalComponent && (
        <ModalComponent
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          modalTitle="Confirm Sign Out"
          modalContent={
            <View>
              <Text>Are you sure you want to sign out?</Text>
              <TouchableOpacity onPress={confirmSignOut} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1, // Divide space equally
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ButtonSignOut;
