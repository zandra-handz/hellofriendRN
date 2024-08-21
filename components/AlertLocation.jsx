import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import { useLocationList } from '../context/LocationListContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

import LoadingPage from '../components/LoadingPage';

const AlertLocation = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  const { selectedLocation, setSelectedLocation, loadingAdditionalDetails } = useLocationList();
  const [useSpinner, setUseSpinner] = useState(true);

  // Define a function to handle closing the modal and resetting the location
  const handleCloseModal = () => {
    setSelectedLocation(null); // Reset the selected location
    toggleModal(); // Toggle the modal visibility
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={23} color="black" /> 
            </TouchableOpacity>
            {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
          </View>

          {loadingAdditionalDetails && useSpinner ? (
            <View style={styles.loadingWrapper}>
              <LoadingPage
                loading={loadingAdditionalDetails}
                spinnerType='wander'
                includeLabel={true}
                label='Just a moment please!'
              />
            </View>
          ) : (
            <View style={styles.modalBody}>{modalContent}</View>
          )}
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

export default AlertLocation;
