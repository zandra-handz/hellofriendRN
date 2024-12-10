
//{showMessage && ( 
//    <View style={styles.previewContainer}>
//        <Text style={styles.previewTitle}>Message</Text>
//        <TextInput
//            style={styles.textInput}
//            value={editedMessage}
//            onChangeText={setEditedMessage}
//            multiline
//        />
//    </View>
//    )}

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'; 
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';  
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import  useStartingAddresses from '../hooks/useStartingAddresses';
import SelectorAddressBase from '../components/SelectorAddressBase'; 
import ResultsTravelComparison from '../components/ResultsTravelComparison';
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';
import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';

import SlideToAdd from '../components/SlideToAdd'; 
import SlideToDelete from '../components/SlideToDelete'; 

const CalculateTravelTimesBody = ({location, currentLocation}) => { 
    const { authUserState } = useAuthUser();
    const { userAddresses, friendAddresses, createFriendAddress, removeFriendAddress } = useStartingAddresses();
    const { themeStyles } = useGlobalStyle();
    const { selectedFriend } = useSelectedFriend();  
    const [message, setMessage] = useState('');
    const [editedMessage, setEditedMessage] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [selectedUserAddress, setSelectedUserAddress] = useState(null);
    const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
    const [showMessage, setShowMessage ] = useState(false);  
    const [ isExistingAddress, setIsExistingAddress ] = useState(false);
    
    
    useEffect(() => {
        if (location && location.address) {
            const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
            setMessage(directionsLink);
            setEditedMessage(`${authUserState.user.username} has sent you a meet up site from the hellofriend app!`);
        } else {
            setMessage('Directions not available.');
            setEditedMessage('Plan details are not available.');
        }
    }, [location, authUserState.user.username]);
 
    const handleUserAddressSelect = (address) => {
        setSelectedUserAddress(address);
        console.log('Selected User Address:', address);
    };

    const handleFriendAddressSelect = (address) => {
        setIsExistingAddress(false);
         const existingAddress = friendAddresses.find(existingAddress => 
            existingAddress.address === address.address || existingAddress.id === address.id
        );
    
         if (existingAddress) {
            setSelectedFriendAddress(existingAddress);
            console.log('Existing Friend Address Selected:', existingAddress);
        } else { setSelectedFriendAddress(address);
            console.log('New Friend Address Selected:', address);
        }
      setIsExistingAddress(!!existingAddress);
    };
    

    const handleAddFriendAddress = (friendId, title, address) => {
        createFriendAddress(friendId, title, address);
    };

    const handleDeleteFriendAddress = (friendId, addressId) => {
        console.log('deleting address triggered', addressId);
        try {
        removeFriendAddress(friendId, addressId);
        setIsExistingAddress(false);
          //  if (friendAddresses.length > 0) {
            
          //  handleFriendAddressSelect(friendAddresses[0]);
          //  console.log('reset address to first in list');

          //  } else {
          //      handleFriendAddressSelect(null);
          //  }
        } catch (error) {
            console.log(error);
        }
    };
 

    useEffect(() => {
        if (currentLocation) {
            console.log(`current location in calculate travel body component: `, currentLocation);
        }
    }, [currentLocation]);
 
    const handleCalculate = () => {
        setTriggerFetch(prev => !prev);
    };

    return (
        <View style={[styles.container, themeStyles.genericTextBackground]}> 
            <View style={styles.locationDetailsContainer}>

                <Text style={[styles.locationTitle, themeStyles.genericText]}>{location?.title}</Text>
                <Text style={[styles.locationAddress, themeStyles.genericText]}>{location?.address}</Text>
                 
                <View style={{height: '18%', width: '100%', marginVertical: '4%'}}> 
                
                    <SelectorAddressBase
                    height={'100%'}
                    titleBottomMargin={'2%'}
                    currentLocation={currentLocation}
                    addresses={userAddresses}
                    onAddressSelect={handleUserAddressSelect}
                    currentAddressOption={true}
                    contextTitle="My startpoint"
                    />   
                </View> 
                 <View style={{height: '18%', width: '100%', marginVertical: '4%'}}> 
                <SelectorAddressBase
                    height={'100%'}
                    titleBottomMargin={'2%'}
                    addresses={friendAddresses}
                    onAddressSelect={handleFriendAddressSelect}
                    contextTitle={`${selectedFriend.name}'s startpoint`}
                />
                </View> 

                {selectedFriendAddress && !isExistingAddress && (
                <Animated.View style={styles.sliderContainer}>
                      <SlideToAdd
                        onPress={() => handleAddFriendAddress(selectedFriend.id, selectedFriendAddress.title, selectedFriendAddress.address)}
                        sliderText={`Save`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={!selectedFriendAddress}
                      />
                </Animated.View> 
                )}
                

                {selectedFriendAddress && selectedFriendAddress.id && isExistingAddress && (
                <Animated.View style={[styles.sliderContainer]}>
                      <SlideToDelete
                        onPress={() => handleDeleteFriendAddress(selectedFriend.id, selectedFriendAddress.id)}
                        sliderText={`Remove from list`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={false} 
                      />
                </Animated.View> 
                )}
                 



            


            <ResultsTravelComparison
                userAddress={selectedUserAddress || { address: 'User Address', lat: '0', lng: '0' }}
                friendAddress={selectedFriendAddress || { address: 'Friend Address', lat: '0', lng: '0' }}
                destinationLocation={location}
                triggerFetch={triggerFetch}
            />
  
            
            </View>

            <ButtonBaseSpecialSave
            label="CALCULATE "
            maxHeight={80}
            onPress={handleCalculate} 
            isDisabled={!selectedUserAddress || !selectedFriendAddress}
            fontFamily={'Poppins-Bold'}
            image={require("../assets/shapes/redheadcoffee.png")}

            /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-between', 
    },
    locationDetailsContainer: { 
        borderRadius: 8, 
        marginVertical: '2%', 
    
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 16, 
    },   
    cardContainer: {
        marginVertical: 10,
    },
    selectorContainer: {
        marginVertical: 10,
    },
    selectorTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginBottom: 5,
    },
    previewContainer: {
        marginVertical: 10,
    },
    previewTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginBottom: 5,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontFamily: 'Poppins-Regular',
        height: 100,
    },
    sliderContainer: {
        height: 24,
        borderRadius: 20,  
        zIndex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }, 
});

export default CalculateTravelTimesBody;
