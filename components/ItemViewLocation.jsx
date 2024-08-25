import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
 
import { addToFriendFavesLocations, removeFromFriendFavesLocations } from '../api'; 
 
import FormLocationQuickCreate from '../forms/FormLocationQuickCreate';  
import ItemViewLocationDetails from './ItemViewLocationDetails';  

import AlertLocation from '../components/AlertLocation';

import ButtonSendDirectionsToFriend from '../components/ButtonSendDirectionsToFriend';
import ButtonCalculateAndCompareTravel from '../components/ButtonCalculateAndCompareTravel';

import FooterActionButtons from '../components/FooterActionButtons';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';

import { useAuthUser } from '../context/AuthUserContext';


const ItemViewLocation = ({ location, onClose }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
  const { locationList, setLocationList, setSelectedLocation, addLocationToFaves, removeLocationFromFaves } = useLocationList();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isTemp, setIsTemp] = useState(false);

  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
      console.log('Location data:', location);
    }
  }, [location]);

  useEffect(() => {
    if (location && location.id) {
      setIsTemp(String(location.id).startsWith('temp'));
    }
  }, [location]); 

  const handleSave = async (newLocation) => {
    try {
      if (isTemp) { 
        const newLocationWithId = { ...newLocation, id: Date.now().toString() }; 
        setLocationList([...locationList, newLocationWithId]);
        setIsEditing(false); 
      } else { 
        if (selectedFriend && location) {
          const response = await addToFriendFavesLocations(authUserState.user.id, selectedFriend.id, location.id);
          addLocationToFaves(location.id);
          const updatedFaves = response;
          console.log(updatedFaves);

          if (friendDashboardData && friendDashboardData.length > 0) {
            friendDashboardData[0].friend_faves = updatedFaves;
            console.log(friendDashboardData);
            updateFriendDashboardData(friendDashboardData); 
          }
        }
        onClose();
      }
    } catch (error) {
      console.error('Error saving new location in handleSave:', error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  }; 

  const handleDelete = async () => {
    try {
      if (selectedFriend && location) {
        const response = await removeFromFriendFavesLocations(authUserState.user.id, selectedFriend.id, location.id);
        removeLocationFromFaves(location.id);
        const updatedFaves = response;

        if (friendDashboardData && friendDashboardData.length > 0) {
          friendDashboardData[0].friend_faves = updatedFaves;
          updateFriendDashboardData(friendDashboardData);
          console.log('Location removed from friend\'s favorites.');
        }

        console.log('Location removed from friend\'s favorites.');
      }
      onClose();
    } catch (error) {
      console.error('Error removing location from favorites in handleUpdate:', error);
    }
  };

  const getLocationTitle = (location) => {
    try {
      let title = location.title || 'Unknown Location';  
      if (location.id && String(location.id).startsWith('temp')) {
        title += ' (unsaved)';
      }
      return title;
    } catch (error) {
      console.error('Error getting location title:', error);
      return location.title;  
    }
  };

  return (
    
    <AlertLocation
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        location ? (
          <View style={styles.modalContainer}> 
              <View style={styles.container}>
                {isEditing ? (
                  <>
                    {isTemp ? (
                      <FormLocationQuickCreate 
                        title={location.title} 
                        address={location.address} 
                        onLocationCreate={handleSave} 
                      />
                    ) : (
                      <>
                        <Button title="Save" onPress={handleSave} />
                        <Button title="Cancel" onPress={() => setIsEditing(false)} />
                      </>
                    )}
                  </>
                ) : (
                  <> 
                    <ItemViewLocationDetails location={location} unSaved={isTemp} />
                  </>
                )}
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
