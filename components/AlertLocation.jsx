import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
//import useLocationFunctions from '../hooks/useLocationFunctions';
import { useLocations } from '../context/LocationsContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LoadingPage from '../components/LoadingPage';
import HeaderBase from '../components/HeaderBase';

const AlertLocation = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  const { selectedLocation, setSelectedLocation, loadingAdditionalDetails } = useLocations();
  const [useSpinner, setUseSpinner] = useState(true);
  const { themeStyles } = useGlobalStyle();
  // Define a function to handle closing the modal and resetting the location
  const handleCloseModal = () => {
    setSelectedLocation(null); // Reset the selected location
    console.log('handleCloseModal in AlertLocation');
    toggleModal(); // Toggle the modal visibility
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <HeaderBase />
       
        <View style={[styles.modalContent, themeStyles.genericTextBackground]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={23} color={themeStyles.modalIconColor.color} /> 
            </TouchableOpacity>
            {modalTitle && <Text style={[styles.modalTitle, themeStyles.genericText]}>{modalTitle}</Text>}
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
    </Modal>
  );
};

const styles = StyleSheet.create({ 
  modalContent: {
    width: '100%',
    flex: 1,
    padding: 4,  
    flex: 1, 
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
    flex: 1,  
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1, 
    width: '100%',
    justifyContent: 'center',
  },
});

export default AlertLocation;
