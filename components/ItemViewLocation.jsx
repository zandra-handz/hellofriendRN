import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import ItemViewLocationDetails from './ItemViewLocationDetails';  
import AlertLocation from '../components/AlertLocation';
import ButtonSendDirectionsToFriend from '../components/ButtonSendDirectionsToFriend';
import ButtonCalculateAndCompareTravel from '../components/ButtonCalculateAndCompareTravel';
import { useLocationList } from '../context/LocationListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ItemViewLocation = ({ location, onClose, isModalVisible }) => {
    const { themeStyles } = useGlobalStyle();
    const { clearAdditionalDetails, selectedLocation, setSelectedLocation } = useLocationList();
    const [isTemp, setIsTemp] = useState(false);

    useEffect(() => {
        if (location) {
            clearAdditionalDetails();
            setSelectedLocation(location);
            console.log('Location data:', location);
        }
    }, [location]);

    useEffect(() => {
        if (location && location.id) {
            setIsTemp(String(location.id).startsWith('temp'));
        }
    }, [location]); 

    const closeModal = () => {
        onClose();
    }; 

    return (
        <AlertLocation
            isModalVisible={isModalVisible} // Use the passed prop here
            toggleModal={closeModal}
            modalContent={
                location ? (
                    <View style={[styles.modalContainer, themeStyles.genericTextBackground]}> 
                        {selectedLocation && ( 
                            <ItemViewLocationDetails location={location} unSaved={isTemp} />
                        )}
                        <View style={styles.buttonContainer}>
                            <ButtonCalculateAndCompareTravel />
                            <ButtonSendDirectionsToFriend />
                        </View>
                    </View>
                ) : null
            }
            modalTitle={location ? "View location" : null}
        /> 
    );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,  
    width: '100%', 
  },
  buttonContainer: {  // Allows the container to take up available space
    height: '16%',  
    flexDirection: 'column',
    justifyContent: 'space-between', // Push buttons to the bottom
      // Center the buttons horizontally
    paddingBottom: 0, // Add padding to the bottom for spacing
  }
});

export default ItemViewLocation;
