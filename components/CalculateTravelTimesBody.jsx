
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


//change height percentage of container inside the main container to adjust screen 

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';  
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import  useStartingAddresses from '../hooks/useStartingAddresses';
import SelectorAddressBase from '../components/SelectorAddressBase'; 
import TravelTimesResults from '../components/TravelTimesResults';
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';

import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';

import SlideToAdd from '../components/SlideToAdd'; 
import SlideToDelete from '../components/SlideToDelete'; 

const CalculateTravelTimesBody = ({location, currentLocation}) => { 
    const { authUserState } = useAuthUser();
    const { userAddresses, friendAddresses, updateFriendDefaultAddress, createUserAddress, createFriendAddress, removeUserAddress, removeFriendAddress } = useStartingAddresses();
    const { themeStyles } = useGlobalStyle();
    const { selectedFriend } = useSelectedFriend();  
    const [message, setMessage] = useState('');
    const [editedMessage, setEditedMessage] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [selectedUserAddress, setSelectedUserAddress] = useState(null);
    const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
    const [showMessage, setShowMessage ] = useState(false);  
    const [ isExistingFriendAddress, setIsExistingFriendAddress ] = useState(false);
    const [ isExistingUserAddress, setIsExistingUserAddress ] = useState(false);
    
    
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
        setIsExistingUserAddress(false);
        setSelectedUserAddress(address);
        const existingUserAddress = userAddresses.find(existingUserAddress => 
            existingUserAddress.address === address.address || existingUserAddress.id === address.id
        );
        if (existingUserAddress) {
            setSelectedUserAddress(existingUserAddress);
            console.log('Existing User Address Selected:', existingUserAddress);
        } else { setSelectedUserAddress(address);
            console.log('New User Address Selected:', address);
        }
      setIsExistingUserAddress(!!existingUserAddress);
    };

    const handleFriendAddressSelect = (address) => {
        setIsExistingFriendAddress(false);
         const existingFriendAddress = friendAddresses.find(existingFriendAddress => 
            existingFriendAddress.address === address.address || existingFriendAddress.id === address.id
        );
    
         if (existingFriendAddress) {
            setSelectedFriendAddress(existingFriendAddress);
            console.log('Existing Friend Address Selected:', existingFriendAddress);
        } else { setSelectedFriendAddress(address);
            console.log('New Friend Address Selected:', address);
        }
      setIsExistingFriendAddress(!!existingFriendAddress);
    };


    useEffect(() => {
        if (selectedFriendAddress) {
            console.log(`selectedFrienAddress changed: `, selectedFriendAddress);
        }

    }, [selectedFriendAddress]);
    
    const handleAddUserAddress = (title, address) => {
        console.log(title, address);
        createUserAddress(title, address);
    };

    const handleDeleteUserAddress = (addressId) => {
        console.log('deleting address triggered', addressId);
        try {
        removeUserAddress(addressId);
        setIsExistingUserAddress(false); 
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateUserDefaultAddress = () => {
        const newData = {
            is_default: true,  //backend will turn the previous one to false
          };
        updateFriendDefaultAddress(selectedFriend.id, selectedFriendAddress.id, newData);
    }

    const handleAddFriendAddress = (friendId, title, address) => {
        createFriendAddress(friendId, title, address);
    };

    const handleDeleteFriendAddress = (friendId, addressId) => {
        console.log('deleting address triggered', addressId);
        try {
        removeFriendAddress(friendId, addressId);
        setIsExistingFriendAddress(false); 
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

            <View style={{height: '46%',  paddingHorizontal: '2%', paddingVertical: '4%', flexDirection: 'column', justifyContent: 'space-between'}}>
            <View style={{ marginVertical: '1%', height: '10%', flexDirection: 'column', justifyContent: 'center', width: '100%'}}> 
                    <Text style={[styles.locationTitle, themeStyles.genericText]}>{location?.title}</Text>
                    <Text style={[styles.locationAddress, themeStyles.genericText]}>{location?.address}</Text> 
                </View>
                <View style={{flexDirection: 'column', maxHeight: 120, height: '30%', justifyContent: 'center', marginVertical: '4%',width: '100%'}}> 
                   <View style={{marginBottom: '1%'}}>
                    <SelectorAddressBase
                    height={'auto'}
                    titleBottomMargin={'2%'}
                    currentLocation={currentLocation}
                    addresses={userAddresses}
                    onAddressSelect={handleUserAddressSelect}
                    currentAddressOption={true}
                    contextTitle="My startpoint"
                    />  
                    
                    
                   </View> 

                {selectedUserAddress && !isExistingUserAddress && (
                <Animated.View style={styles.sliderContainer}>
                      <SlideToAdd
                        onPress={() => handleAddUserAddress(selectedUserAddress.title, selectedUserAddress.address)}
                        sliderText={`Save`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={!selectedFriendAddress}
                      />
                </Animated.View> 
                )}
                

                {selectedUserAddress && selectedUserAddress.id && isExistingUserAddress && (
                <Animated.View style={[styles.sliderContainer]}>
                      <SlideToDelete
                        onPress={() => handleDeleteUserAddress(selectedUserAddress.id)}
                        
                        sliderText={`Remove from list`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={false} 
                      />
                </Animated.View> 
                )}
                
                </View> 
                
                <View style={{flexDirection: 'column', height: '30%', maxHeight: 120, justifyContent: 'center', marginVertical: '4%',width: '100%'}}> 
                   <View style={{marginBottom: '1%'}}>
                        <SelectorAddressBase
                            height={'auto'}
                            titleBottomMargin={'2%'}
                            addresses={friendAddresses}
                            onAddressSelect={handleFriendAddressSelect}
                            contextTitle={`${selectedFriend.name}'s startpoint`}
                        /> 
                    </View>


                         
                {selectedFriendAddress && !isExistingFriendAddress && (
                
                
                <Animated.View style={styles.sliderContainer}>
                      <SlideToAdd
                        onPress={() => handleAddFriendAddress(selectedFriend.id, selectedFriendAddress.title, selectedFriendAddress.address)}
                        sliderText={`Save`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={!selectedFriendAddress}
                      />
                </Animated.View> 
                )}
                

                {selectedFriendAddress && selectedFriendAddress.id && isExistingFriendAddress && (
                <>
                <TouchableOpacity onPress={() => handleUpdateUserDefaultAddress()} style={{width: 50, height: 20, backgroundColor: 'blue'}}>

                </TouchableOpacity>
                
                
                <Animated.View style={[styles.sliderContainer]}>
                      <SlideToDelete
                        onPress={() => handleDeleteFriendAddress(selectedFriend.id, selectedFriendAddress.id)}
                        sliderText={`Remove from list`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={false} 
                      />
                </Animated.View> 
                </>
                )}

                
                
                </View> 
            </View>
                 



            

 

            
            <View style={{flexGrow: 1, width: '100%', paddingBottom: '4%', alignItems: 'center', justifyContent: 'center'}}>
                
            <TravelTimesResults
                userAddress={selectedUserAddress || { address: 'User Address', lat: '0', lng: '0' }}
                friendAddress={selectedFriendAddress || { address: 'Friend Address', lat: '0', lng: '0' }}
                friendName={selectedFriend?.name || null}
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
        justifyContent: 'space-between',
    
    },
    headerContainer: { 

    },
    locationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 18, 
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
