import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AlertLocation from '../components/AlertLocation';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import { useAuthUser } from '../context/AuthUserContext';

import LoadingPage from '../components/LoadingPage';

import ItemViewFooter from './ItemViewFooter';
import { addToFriendFavesLocations, removeFromFriendFavesLocations } from '../api'; // Adjust the import path as needed

import FormLocationQuickCreate from '../forms/FormLocationQuickCreate'; // Adjust the import path as needed
import ItemViewLocationDetails from './ItemViewLocationDetails'; // Import the new component
import ButtonSendDirectionsToFriend from '../components/ButtonSendDirectionsToFriend';

import ButtonCalculateAndCompareTravel from '../components/ButtonCalculateAndCompareTravel';
import ButtonFindMidpoints from '../components/ButtonFindMidpoints';

const ItemViewLocation = ({ location, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
  const { locationList, setLocationList, selectedLocation, setSelectedLocation, additionalDetails, loadingAdditionalDetails, faveLocationList, addLocationToFaves, removeLocationFromFaves } = useLocationList();
  
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (newLocation) => {
    try {
      if (isTemp) { 
        const newLocationWithId = { ...newLocation, id: Date.now().toString() }; // Generate a unique ID for the new location
        setLocationList([...locationList, newLocationWithId]);
        setIsEditing(false); // Optionally close editing mode after saving
      } else {
        // If the location is not temporary, update or add the location to the friend's favorites
        if (selectedFriend && location) {
          const response = await addToFriendFavesLocations(authUserState.user.id, selectedFriend.id, location.id);
          addLocationToFaves(location.id);
          const updatedFaves = response;
          console.log(updatedFaves);

          if (friendDashboardData && friendDashboardData.length > 0) {
            friendDashboardData[0].friend_faves = updatedFaves;
            console.log(friendDashboardData);
            updateFriendDashboardData(friendDashboardData);
            console.log('Location added to friend\'s favorites.');
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

  const handleUpdate = async () => {
    try {
      if (selectedFriend && location) {
        const response = await addToFriendFavesLocations(authUserState.user.id, selectedFriend.id, location.id);
        addLocationToFaves(location.id);
        const updatedFaves = response;
        console.log(updatedFaves);

        if (friendDashboardData && friendDashboardData.length > 0) {
          friendDashboardData[0].friend_faves = updatedFaves;
          updateFriendDashboardData(friendDashboardData);
          console.log('Location added to friend\'s favorites.');
        }
      }
      onClose();
    } catch (error) {
      console.error('Error adding location to favorites in handleUpdate:', error);
    }
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
      let title = location.title || 'Unknown Location'; // Default title if location.title is undefined
      if (location.id && String(location.id).startsWith('temp')) {
        title += ' (unsaved)';
      }
      return title;
    } catch (error) {
      console.error('Error getting location title:', error);
      return location.title; // Fallback title in case of an error
    }
  };

  return (
    
    <AlertLocation
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        location ? (
          <View style={styles.modalContainer}>
            {loadingAdditionalDetails && (
              <LoadingPage loading={loadingAdditionalDetails} spinnerType='circle' />
            )}
            {!loadingAdditionalDetails && (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <View style={styles.buttonContainer}>
              <ButtonCalculateAndCompareTravel />
              <ButtonSendDirectionsToFriend />
              <ButtonFindMidpoints onPress={closeModal} /> 
              </View> 
            </ScrollView>
            )}
            
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: { 
    flex: 1,
    padding: 0, 
  }, 
  buttonContainer: {
    height: '30%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',

  },
});

export default ItemViewLocation;
