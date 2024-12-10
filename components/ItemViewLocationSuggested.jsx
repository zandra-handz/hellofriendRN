import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'; 
import AlertLocation from '../components/AlertLocation';


import ItemViewLocationDetails from './ItemViewLocationDetails'; // Import the new component
import FooterActionButtons from '../components/FooterActionButtons';
 
import useLocationFunctions from '../hooks/useLocationFunctions';

const ItemViewLocationSuggested = ({ onClose }) => {
  const [ isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);  
  const { selectedLocation } = useLocationFunctions();
  
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
