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
    const { clearAdditionalDetails, setSelectedLocation } = useLocationList();
    
    const [isTemp, setIsTemp] = useState(false);

    useEffect(() => {
        console.log('Received location:', location);
        if (location) {
            clearAdditionalDetails();
            setSelectedLocation(location);
            console.log('Setting selectedLocation to:', location);
        }
    }, [location]);

    useEffect(() => {
        if (location && location.id) {
            setIsTemp(String(location.id).startsWith('temp'));
        }
    }, [location]); 

    useEffect(() => {
        console.log('Modal visibility changed:', isModalVisible);
        if (isModalVisible) {
            console.log('Modal is opening...');
        } else {
            console.log('Modal is closing...');
        }
    }, [isModalVisible]);

    const closeModal = () => { 
        onClose();
    }; 

    return (
        <> 
        <AlertLocation
            isModalVisible={isModalVisible} // Use the passed prop here
            toggleModal={closeModal}
            modalContent={
                location ? (
                    <View style={[styles.modalContainer, themeStyles.genericTextBackground]}> 
                        <ItemViewLocationDetails location={location} unSaved={isTemp} />
                        <View style={styles.buttonContainer}>
                            <ButtonCalculateAndCompareTravel />
                            <ButtonSendDirectionsToFriend />
                        </View>
                    </View>
                ) : null
            }
            modalTitle={location ? "View location" : null}
        />  
        </>
    );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,  
    width: '100%', 
  },
  buttonContainer: {
    height: '16%',  
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 0,
  }
});

export default ItemViewLocation;
