// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
 //   console.log('Location added to friend\'s favorites.');
//  }

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
 
import MenuLocationOptions from '../components/MenuLocationOptions';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
 
const LocationEditActions = ({ location, favorite=false, saveable=true, size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    const { authUserState } = useAuthUser();
    const { themeAheadOfLoading } = useFriendList();
    const { selectedFriend, friendDashboardData, updateFriendDashboardData } = useSelectedFriend();
    const { handleAddToFaves, handleRemoveFromFaves, handleDeleteLocation, faveLocationList, deleteLocationMutation, addLocationToFaves, removeLocationFromFaves } = useLocationFunctions();
  
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);
 
 
 

    const handlePress = () => {
        setModalVisible(true);
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
     

    return (
        <View> 

            {location && !String(location.id).startsWith('temp') && (
                <View style={styles.container}> 
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
                        location={location}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onHelp={handleHelp}
                        closeMenu={toggleMenu} // Pass the function to close the menu
                    />
                </View>
            </Modal> 
 
            
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

export default LocationEditActions;
