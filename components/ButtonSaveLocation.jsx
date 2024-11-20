// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
 //   console.log('Location added to friend\'s favorites.');
//  }

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; 
import FavoriteProfileSvg from '../assets/svgs/favorite-profile.svg';  

import AlertConfirm from '../components/AlertConfirm'; 
import ModalAddNewLocation from '../components/ModalAddNewLocation';

import MenuLocationOptions from '../components/MenuLocationOptions';
import { addToFriendFavesLocations, removeFromFriendFavesLocations } from '../api'; 

import { useSelectedFriend } from '../context/SelectedFriendContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useQueryClient } from '@tanstack/react-query';

const ButtonSaveLocation = ({ location, saveable=true, size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    const { authUserState } = useAuthUser();
    const { themeAheadOfLoading } = useFriendList();
    const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
    const { locationList, handleDeleteLocation, faveLocationList, deleteLocationMutation, addLocationToFaves, removeLocationFromFaves } = useLocationFunctions();
    const [isATemp, setIsTemp ] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);
    const { themeStyles } = useGlobalStyle();


    const [ isFave, setIsFave ] = useState(false);

    useLayoutEffect(() => {
        console.log(faveLocationList);
        if (location) {
            setIsFave(faveLocationList.some(faveLocation => faveLocation.id === location.id));
        };

    }, [location]);

    const queryClient = useQueryClient();

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
        console.log(location.id);
        handleDeleteLocation(location.id);
        setMenuVisible(false);
    };

    const handleHelp = () => {
        // Handle help
    };

    const onClose = () => {
        setModal2Visible(false);


    };
    



    const handleRemoveFromFaves = async () => {
        if  (selectedFriend && location && isFave) {
            const response = await removeFromFriendFavesLocations(authUserState.user.id, selectedFriend.id, location.id);
            removeLocationFromFaves(location.id);
            const updatedFaves = response;
            console.log(updatedFaves);

            if (friendDashboardData && friendDashboardData.length > 0) {
                const updatedFriendDashboardData = [...friendDashboardData];
                updatedFriendDashboardData[0].friend_faves = updatedFaves;
              
                 queryClient.setQueryData(['friendDashboardData', selectedFriend?.id], updatedFriendDashboardData);
              
                console.log('Location added to friend\'s favorites.');
              }
            onClose();
        }
    };

    const handleAddToFaves = async () => {
        try {
          if (isTemp) { 
            
            const newLocationWithId = { ...location, id: Date.now().toString() }; // Generate a unique ID for the new location
            //setLocationList([...locationList, newLocationWithId]);
            setIsEditing(false); 
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
          handleRemoveFromFaves(location.id);
        } else {
          handleAddToFaves(location);
        }
      };

    return (
        <View>
            {location && String(location.id).startsWith('temp') && (
                <TouchableOpacity onPress={handlePress} style={[styles.container, style]}> 
                    <FontAwesome5 name="save" size={iconSize} color={themeStyles.modalIconColor.color} /> 
                    <Text style={[styles.saveText, { fontSize: size, color: themeStyles.genericText.color, fontFamily: family }]}> SAVE</Text>
                </TouchableOpacity>
            )}

            {location && !String(location.id).startsWith('temp') && (
                <View style={styles.container}>

                    <View style={styles.iconContainer}>
                    {!isFave && (
                    <PushPinSolidSvg width={20} height={20} color={themeAheadOfLoading.fontColor} onPress={toggleModal2}/>
                    )}
                    {isFave && (
                    <FavoriteProfileSvg width={28} height={28} color={themeAheadOfLoading.lightColor} onPress={toggleModal2}/>
                    )}
                    </View>
                    <View style={styles.iconContainer}>
                    <FontAwesome5 name="ellipsis-v" size={24} color={themeAheadOfLoading.fontColor}  onPress={toggleMenu} />
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
            {location && ( 
            <ModalAddNewLocation 
                isVisible={isModalVisible}
                close={closeModal}
                title={location.title}
                address={location.address}
            />
            )}
 
           
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
        paddingRight: 2,
    }, 
    iconContainer: {
        margin: 0,
        marginLeft: 18,

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
