import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; 
import PushPinOutlineSvg from '../assets/svgs/push-pin-outline.svg';  
import FavoriteProfileSvg from '../assets/svgs/favorite-profile.svg';  

import AlertConfirm from '../components/AlertConfirm';
import AlertSmall from '../components/AlertSmall';
import InputAddLocationQuickSave from '../components/InputAddLocationQuickSave';
import MenuLocationOptions from '../components/MenuLocationOptions';
import { addToFriendFavesLocations, removeFromFriendFavesLocations } from '../api'; 

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import { useAuthUser } from '../context/AuthUserContext';


const ButtonSaveLocation = ({ location, saveable=true, size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    const { authUserState } = useAuthUser();
    const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
    const { locationList, setLocationList, selectedLocation, isTemp, isFave, setSelectedLocation, faveLocationList, addLocationToFaves, removeLocationFromFaves } = useLocationList();
    const [isATemp, setIsTemp ] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);

    const handlePress = () => {
        setModalVisible(true);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleModal2 = () => {
        setModal2Visible(!isModal2Visible);
    };

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    const closeModal = () => {
        setModalVisible(false);
        setMenuVisible(false);
    };

    const closeModal2 = () => {
        setModal2Visible(false); 
    };

    const handleEdit = () => {
        // Handle edit location
    };

    const handleDelete = () => {
        // Handle delete location
    };

    const handleHelp = () => {
        // Handle help
    };

    const onClose = () => {
        setModal2Visible(false);


    };
    
    
    useEffect(() => {
        console.log('Selected Location:', selectedLocation);
        console.log('Is Temp:', isTemp);
    }, [selectedLocation, isTemp]);


    const handleRemoveFromFaves = async () => {
        if  (selectedFriend && selectedLocation && isFave) {
            const response = await removeFromFriendFavesLocations(authUserState.user.id, selectedFriend.id, selectedLocation.id);
            removeLocationFromFaves(selectedLocation.id);
            const updatedFaves = response;
            console.log(updatedFaves);

            if (friendDashboardData && friendDashboardData.length > 0) {
                friendDashboardData[0].friend_faves = updatedFaves;
                console.log(friendDashboardData);
                updateFriendDashboardData(friendDashboardData);
                console.log('Location added to friend\'s favorites.');
              }
            onClose();
        }
    };

    const handleAddToFaves = async () => {
        try {
          if (isTemp) { 
            
            const newLocationWithId = { ...selectedLocation, id: Date.now().toString() }; // Generate a unique ID for the new location
            setLocationList([...locationList, newLocationWithId]);
            setIsEditing(false); 
          } else {

            // If the location is not temporary, update or add the location to the friend's favorites
            if (selectedFriend && selectedLocation) {
              const response = await addToFriendFavesLocations(authUserState.user.id, selectedFriend.id, selectedLocation.id);
              addLocationToFaves(selectedLocation.id);
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

      const onConfirmAction = () => {
        if (isFave) {
          handleRemoveFromFaves(selectedLocation.id);
        } else {
          handleAddToFaves(selectedLocation);
        }
      };

    return (
        <View>
            {selectedLocation && isTemp && (
                <TouchableOpacity onPress={handlePress} style={[styles.container, style]}> 
                    <FontAwesome5 name="save" size={iconSize} /> 
                    <Text style={[styles.saveText, { fontSize: size, color: color, fontFamily: family }]}> SAVE</Text>
                </TouchableOpacity>
            )}

            {selectedLocation && !isTemp && (
                <View style={styles.container}>

                    <View style={styles.iconContainer}>
                    {!isFave && (
                    <PushPinOutlineSvg width={18} height={18} color='black' onPress={toggleModal2}/>
                    )}
                    {isFave && (
                    <FavoriteProfileSvg width={28} height={28} color='black' onPress={toggleModal2}/>
                    )}
                    </View>
                    <View style={styles.iconContainer}>
                    <FontAwesome5 name="ellipsis-v" size={iconSize} onPress={toggleMenu} />
                    </View>
                </View>
            )}
 
            <Modal
                visible={isMenuVisible}
                transparent
                animationType="slide"
                onRequestClose={toggleMenu}
            >
                <View style={styles.modalBackground}>
                    <MenuLocationOptions
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onHelp={handleHelp}
                        closeMenu={toggleMenu} // Pass the function to close the menu
                    />
                </View>
            </Modal>
 
            <AlertSmall
                isModalVisible={isModalVisible}
                toggleModal={closeModal}
                modalContent={
                    <InputAddLocationQuickSave
                        onClose={closeModal}
                        title={selectedLocation.title}
                        address={selectedLocation.address}
                    />
                }
                modalTitle={'Save Location'}
            />
            <AlertConfirm
                isModalVisible={isModal2Visible}
                toggleModal={closeModal2} 
                headerContent={<PushPinSolidSvg width={18} height={18} color='black' />}
                questionText={isFave ? "Remove this location from friend's dashboard?" : "Pin this location to friend dashboard?"}
                onConfirm={onConfirmAction}
                onCancel={closeModal2}
                confirmText="Yes"
                cancelText="No"
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    }, 
    iconContainer: {
        margin: 4,
        marginLeft: 14,

    },
    saveText: {
        marginLeft: 8, 
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
});

export default ButtonSaveLocation;
