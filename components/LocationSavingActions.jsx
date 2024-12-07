// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
 //   console.log('Location added to friend\'s favorites.');
//  }

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'; 

import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg';  

import AlertConfirm from '../components/AlertConfirm'; 
import ModalAddNewLocation from '../components/ModalAddNewLocation';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import HeartAddOutlineSvg from '../assets/svgs/heart-add-outline.svg';
import HeartCheckSolidSvg from '../assets/svgs/heart-check-solid.svg';
import AddSquareOutlineSvg from '../assets/svgs/add-square-outline.svg';

const LocationSavingActions = ({ location, favorite=false,  size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    const { themeAheadOfLoading } = useFriendList();
    const { selectedFriend, friendDashboardData } = useSelectedFriend();
    const { handleAddToFaves, handleRemoveFromFaves  } = useLocationFunctions();
  
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);
    const { themeStyles } = useGlobalStyle();

    const navigation = useNavigation();  


    const [ isFave, setIsFave ] = useState(false);


    const handleGoToLocationSaveScreen = () => {
        navigation.navigate('LocationSave', { location: location });

   }

 
    useEffect(() => { 
        if (favorite && location && location.id) {
            console.log('location id in button save',location.id);
            setIsFave(true); 
        } else if (friendDashboardData?.[0]?.friend_faves?.locations) {
            setIsFave(friendDashboardData[0].friend_faves.locations.includes(location.id));
        } else {
            setIsFave(false);  
        }
    }, [location]);
 

    const handlePress = () => {
        setModalVisible(true);
    }; 

    const toggleModal2 = () => {
        setModal2Visible(!isModal2Visible);
    };

   

    const closeModal = () => {
        setModalVisible(false); 
    };

    const closeModal2 = () => {
        setModal2Visible(false); 
    };

 
    const onClose = () => {
        setModal2Visible(false);


    };
    

    const removeFromFaves = async () => {
        if  (selectedFriend && location && isFave) {
            handleRemoveFromFaves(selectedFriend.id, location.id);
            onClose();
        }
    };

    const addToFaves = async () => {
        try {
          if (String(location.id).startsWith('temp')) { 
            console.log('location not a saved object yet/add code to ButtonSaveLocation pls');
             
            setIsEditing(false); 
          } else {

            if (selectedFriend && location) {
              handleAddToFaves(selectedFriend.id, location.id);
            }
            onClose();
          }
        } catch (error) {
          console.error('Error saving new location in handleSave:', error);
        }
      };

      const onConfirmAction = () => {
        if (isFave) {
          removeFromFaves(location.id);
          setIsFave(false);
        } else {
          addToFaves(location);
          setIsFave(true);
        }
      };

    return (
        <View>
            {location && String(location.id).startsWith('temp') && (
                <TouchableOpacity style={[styles.container, style]}> 
                    <AddSquareOutlineSvg width={34} height={34} color={themeStyles.genericText.color} onPress={handleGoToLocationSaveScreen}/>
                   
                    <Text style={[styles.saveText, {  color: themeStyles.genericText.color, fontFamily: family }]}> ADD </Text>
                </TouchableOpacity>
            )}

            {location && !String(location.id).startsWith('temp') && (
                <View style={styles.container}>

                    <View style={styles.iconContainer}>
                    {!isFave && (
                    <HeartAddOutlineSvg width={34} height={34} color={themeStyles.genericText.color} onPress={handlePress} />
                    )}
                    {isFave && (
                    <HeartCheckSolidSvg width={34} height={34} color={themeAheadOfLoading.lightColor} onPress={handlePress} />
                    )}
                    </View> 
                </View>
            )}
   
            {location && ( 
            <ModalAddNewLocation 
                isVisible={isModal2Visible}
                close={closeModal2}
                title={location.title}
                address={location.address}
            />
            )}
 
           
            <AlertConfirm
                isModalVisible={isModalVisible}
                toggleModal={closeModal} 
                headerContent={<PushPinSolidSvg width={18} height={18} color='black' />}
                questionText={isFave ? "Remove this location from friend's dashboard?" : "Pin this location to friend dashboard?"}
                onConfirm={onConfirmAction}
                onCancel={closeModal}
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

export default LocationSavingActions;
