import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import { useLocationList } from '../context/LocationListContext';
import ArrowBackSharpOutlineSvg from '../assets/svgs/arrow-back-sharp-outline.svg';
import LoadingPage from '../components/LoadingPage';

const AlertLocation = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  const { selectedLocation, setSelectedLocation, loadingAdditionalDetails } = useLocationList();

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
              <ArrowBackSharpOutlineSvg width={36} height={36} color="black" />
            </TouchableOpacity>
            {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
          </View>

          {loadingAdditionalDetails ? (
            <View style={styles.loadingWrapper}>
              <LoadingPage loading={loadingAdditionalDetails} spinnerType='circle' />
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
    borderRadius: 
    0,
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
    marginRight: 8, // Space between button and title
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
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
