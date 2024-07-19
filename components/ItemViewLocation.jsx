import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import { useAuthUser } from '../context/AuthUserContext';
import ItemViewFooter from './ItemViewFooter';
import { addToFriendFavesLocations, removeFromFriendFavesLocations, saveNewLocation } from '../api'; // Adjust the import path as needed

const ItemViewLocation = ({ location, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
  const { locationList, setLocationList, selectedLocation, setSelectedLocation, faveLocationList, addLocationToFaves, removeLocationFromFaves } = useLocationList();

  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
      console.log('Location data:', location);
    }
  }, [location]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (selectedFriend && location) {
        // See InputAddLocationQuickSave
        setIsEditing(false); // Optionally close editing mode after saving

        // Handle updating the location list or other state changes as needed
        console.log(response);
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
          console.log(friendDashboardData);
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
      console.error('Error removing location to favorites in handleUpdate:', error);
    }
  };

  const getLocationTitle = (location) => {
    let title = location.title;
    if (location.id.startsWith('temp')) {
      title += ' (unsaved)';
    }
    return title;
  };

  return (
    <AlertImage
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        location ? (
          <View>
            <Text>{location.address}</Text>
            {isEditing ? (
              <>
                <Button title="Save" onPress={handleSave} />
                <Button title="Cancel" onPress={() => setIsEditing(false)} />
              </>
            ) : (
              <>
                <Text style={styles.modalText}> </Text>
                <ItemViewFooter
                  buttons={[
                    { label: location.id.startsWith('temp') ? 'Save' : 'Edit', icon: location.id.startsWith('temp') ? 'save' : 'edit', color: location.id.startsWith('temp') ? 'green' : 'blue', onPress: location.id.startsWith('temp') ? handleSave : handleEdit },
                    { label: 'Delete', icon: 'trash-alt', color: 'red', onPress: handleDelete },
                    { label: 'Share', icon: 'share', color: 'green', onPress: handleDelete },
                  ]}
                />
              </>
            )}
          </View>
        ) : null
      }
      modalTitle={location ? getLocationTitle(location) : null}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Adjust padding as needed
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  imageContainer: {
    padding: 10,
    width: '100%',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  icon: {
    marginHorizontal: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagLabel: {
    fontSize: 16,
  },
});

export default ItemViewLocation;
