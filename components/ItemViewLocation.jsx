import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import { useAuthUser } from '../context/AuthUserContext';
import ItemViewFooter from './ItemViewFooter';
import { addToFriendFavesLocations, removeFromFriendFavesLocations } from '../api'; // Adjust the import path as needed

const ItemViewLocation = ({ location, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [includeTag, setIncludeTag] = useState(false);
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
  const { locationList, setLocationList } = useLocationList();

  useEffect(() => {
    if (location) {
      console.log('Location data:', location);
    }
  }, [location]);

  const handleEdit = () => {
    setIsEditing(true);
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
        const updatedFaves = response.data;
        
        if (friendDashboardData && friendDashboardData.length > 0) {
          friendDashboardData[0].friend_faves = updatedFaves;
          updateFriendDashboardData(selectedFriend.id, friendDashboardData);
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
        const updatedFaves = response.data;

        if (friendDashboardData && friendDashboardData.length > 0) {
          friendDashboardData[0].friend_faves = updatedFaves;
          updateFriendDashboardData(selectedFriend.id, friendDashboardData);
          console.log('Location removed from friend\'s favorites.');
        }
        
        console.log('Location removed from friend\'s favorites.');
      }
      onClose();
    } catch (error) {
      console.error('Error removing location to favorites in handleUpdate:', error);
    }
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
                <Button title="Update" onPress={handleUpdate} />
                <Button title="Cancel" onPress={() => setIsEditing(false)} />
              </>
            ) : (
              <>
                <Text style={styles.modalText}> </Text>
                <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: 'edit', color: 'blue', onPress: handleEdit },
                    { label: 'Delete', icon: 'trash-alt', color: 'red', onPress: handleDelete },
                    { label: 'Share', icon: 'share', color: 'green', onPress: handleDelete },
                  ]}
                />
              </>
            )}
          </View>
        ) : null
      }
      
      modalTitle={location && location.title ? location.title : null}
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
