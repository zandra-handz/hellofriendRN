// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
 //   console.log('Location added to friend\'s favorites.');
//  }

import React, { useLayoutEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StyleSheet  } from 'react-native';
import AlertList from '../components/AlertList'; 
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import NotesOutlineSvg from '../assets/svgs/notes-outline.svg';
import NotesSolidSvg from '../assets/svgs/notes-solid.svg';
import DistanceZigZagSvg from '../assets/svgs/distance-zigzag.svg';
import ClockOutlineSvg from '../assets/svgs/clock-outline.svg';
import { useNavigation } from '@react-navigation/native'; 
import useCurrentLocation from '../hooks/useCurrentLocation'; 


const LocationTravelTimes = ({ location, favorite=false,  size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    const { themeAheadOfLoading } = useFriendList();
    const [ isModalVisible, setModalVisible ] = useState(false);
    const { themeStyles } = useGlobalStyle();
    const [ hasNotes, setHasNotes ] = useState(false);
    const { currentLocationDetails  } = useCurrentLocation();
 
 

    const navigation = useNavigation();  


    const closeModalAfterDelay = () => {
        let timeout;
        timeout = setTimeout(() => {
            setModalVisible(false);

        }, 1000);
    }

    const handleGoToCalculateTravelTimesScreen = () => {
         navigation.navigate('CalculateTravelTimes', {location: location, currentLocation: currentLocationDetails || null});
        //doesn't help
         closeModalAfterDelay();
    }
  

 
 
 

    const handlePress = () => {
        setModalVisible(true);
    }; 

    const toggleModal = () => {
        setModalVisible(prev => !prev);
    }

    useLayoutEffect(() => {
        if (location && (location.personal_experience_info || location.parking_score)) {
            setHasNotes(true);
        } else {
            setHasNotes(false);
        } 
    }, [location])

 
 

    return (
        <View> 
            {location && !String(location.id).startsWith('temp') && (
                <View style={styles.container}>

                    <View style={styles.iconContainer}>
                    {!hasNotes && (
                    <>
                        <View style={{position: 'absolute', top:-6}}>
                            <ClockOutlineSvg width={20} height={20} color={themeStyles.genericText.color} onPress={handleGoToCalculateTravelTimesScreen} />
                        </View>
                    <DistanceZigZagSvg width={34} height={34} color={themeStyles.genericText.color} onPress={handleGoToCalculateTravelTimesScreen} />
                    </>
                    )}
                    {hasNotes && (
                    <ClockOutlineSvg width={34} height={34} color={themeAheadOfLoading.lightColor} onPress={handleGoToCalculateTravelTimesScreen} />
                    )}
                    </View> 
                </View>
            )}
    
 
        <AlertList
        includeBottomButtons={false}
        isModalVisible={isModalVisible}
        useSpinner={false}
        questionText={'Notes'}
        toggleModal={toggleModal}
        includeSearch={false}
        headerContent={<NotesOutlineSvg width={42} height={42} color={themeStyles.modalIconColor.color} />}
        
        content={
 
                
            <View> 
    
                {location.personal_experience_info && (
                    <Text style={themeStyles.genericText}>{location.personal_experience_info}</Text>
                )}
            <TouchableOpacity onPress={handleGoToCalculateTravelTimesScreen} style={{width: 40, height: 40, backgroundColor: 'pink'}}></TouchableOpacity>
                {location.parking_score && (
                    <Text style={themeStyles.genericText}>{location.parking_score}</Text>
                )}
            </View>
              
            }
        onCancel={toggleModal}
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
    textContainer: {
        padding: 20,
      },
      containerTitle: {
        fontSize: 16,
        marginBottom: '4%',
      },
      textInput: {
        textAlign: 'top',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        height: 100,
      },
});

export default LocationTravelTimes;
