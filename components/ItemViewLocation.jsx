import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { addToFriendFavesLocations } from '../api'; 

import ItemViewLocationDetails from './ItemViewLocationDetails';  

import AlertLocation from '../components/AlertLocation';

import ButtonSendDirectionsToFriend from '../components/ButtonSendDirectionsToFriend';
import ButtonCalculateAndCompareTravel from '../components/ButtonCalculateAndCompareTravel';

import FooterActionButtons from '../components/FooterActionButtons';

import { useLocationList } from '../context/LocationListContext';


const ItemViewLocation = ({ location, onClose }) => {
  const { clearAdditionalDetails, selectedLocation, setSelectedLocation, addLocationToFaves } = useLocationList();
  const [isModalVisible, setIsModalVisible] = useState(true);
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
    setIsModalVisible(false); 
    onClose();
  }; 
 
 

  return (
    
    <AlertLocation
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        location ? (
          <View style={styles.modalContainer}> 
              <View style={styles.container}> 
                  <> 
                  {selectedLocation && ( 
                    <ItemViewLocationDetails location={location} unSaved={isTemp} />
                  )}
                  </>
                
              </View>

            <FooterActionButtons
              height='9%'
              bottom={66} 
              backgroundColor='white'
              buttons={[
                <ButtonCalculateAndCompareTravel />,
                <ButtonSendDirectionsToFriend />,
              ]}
            />
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
  },
  container: { 
    flex: 1,
    padding: 0, 
  },  
});

export default ItemViewLocation;
