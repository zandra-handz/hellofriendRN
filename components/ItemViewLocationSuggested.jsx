import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AlertImage from '../components/AlertImage';
import AlertLocation from '../components/AlertLocation';

import { addToFriendFavesLocations} from '../api'; 

import ItemViewLocationDetails from './ItemViewLocationDetails'; // Import the new component
import ButtonSendDirectionsToFriend from '../components/ButtonSendDirectionsToFriend';
import ButtonCalculateAndCompareTravel from '../components/ButtonCalculateAndCompareTravel';
import FooterActionButtons from '../components/FooterActionButtons';
 
import { useLocationList } from '../context/LocationListContext';
 
const ItemViewLocationSuggested = ({ onClose }) => {
  const [ setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);  
  const { selectedLocation } = useLocationList();
  
  const [isTemp ] = useState(false);


  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  };


  return (
    <AlertLocation
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        selectedLocation ? (
          <View style={styles.modalContainer}> 
              <View style={styles.container}>
                <> 
                  <ItemViewLocationDetails location={selectedLocation} unSaved={isTemp} />
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
      modalTitle={selectedLocation ? "View search result" : null}
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
  }, 
  container: { 
    flex: 1,
    padding: 0, 
  },    
});

export default ItemViewLocationSuggested;
