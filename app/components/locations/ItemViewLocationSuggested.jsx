import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'; 
import AlertLocation from '../alerts/AlertLocation';


import ItemViewLocationDetails from './ItemViewLocationDetails'; 
import FooterActionButtons from '../appwide/button/FooterActionButtons';
  
import { useLocations } from '@/src/context/LocationsContext';


const ItemViewLocationSuggested = ({ onClose }) => {
  const [ isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);  
  const { selectedLocation } = useLocations();
  
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
