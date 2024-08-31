import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg'; // Import the SVG
import { useAuthUser } from '../context/AuthUserContext';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; // Import the context
import SelectorAddressBase from '../components/SelectorAddressBase'; // Import the base component
import ResultsTravelComparison from '../components/ResultsTravelComparison';

const CompareTravel = ({ size = 14, family = 'Poppins-Regular', color = "black", style }) => {
    const { selectedLocation } = useLocationList();
    const { authUserState } = useAuthUser();
    const { friendDashboardData } = useSelectedFriend(); // Access selected friend data
    const [message, setMessage] = useState('');
    const [editedMessage, setEditedMessage] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [selectedUserAddress, setSelectedUserAddress] = useState(null);
    const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
    const [showMessage, setShowMessage ] = useState(false); // Just for me to turn off right now
    useEffect(() => {
        if (selectedLocation && selectedLocation.address) {
            const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`;
            setMessage(directionsLink);
            setEditedMessage(`${authUserState.user.username} has sent you a meet up site from the hellofriend app!`);
        } else {
            setMessage('Directions not available.');
            setEditedMessage('Plan details are not available.');
        }
    }, [selectedLocation, authUserState.user.username]);

    // Handle address selection
    const handleUserAddressSelect = (address) => {
        setSelectedUserAddress(address);
        console.log('Selected User Address:', address);
    };

    const handleFriendAddressSelect = (address) => {
        setSelectedFriendAddress(address);
        console.log('Selected Friend Address:', address);
    };

    // Trigger fetch for travel comparison
    const handleCalculate = () => {
        setTriggerFetch(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <View style={styles.locationContainer}>
                <Text style={styles.locationTitle}>{selectedLocation?.title}</Text>
                <Text style={styles.locationAddress}>{selectedLocation?.address}</Text>
            </View>

            {showMessage && ( 
            <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Message</Text>
                <TextInput
                    style={styles.textInput}
                    value={editedMessage}
                    onChangeText={setEditedMessage}
                    multiline
                />
            </View>
            )}

            <SelectorAddressBase
                addresses={authUserState.user.addresses}
                onAddressSelect={handleUserAddressSelect}
                contextTitle="My Address"
            /> 
            
            {friendDashboardData && Array.isArray(friendDashboardData[0]?.friend_addresses) && (
                <SelectorAddressBase
                    addresses={friendDashboardData[0].friend_addresses}
                    onAddressSelect={handleFriendAddressSelect}
                    contextTitle="Friend's starting point"
                />
            )}

            <ResultsTravelComparison
                userAddress={selectedUserAddress || { address: 'User Address', lat: '0', lng: '0' }}
                friendAddress={selectedFriendAddress || { address: 'Friend Address', lat: '0', lng: '0' }}
                destinationLocation={selectedLocation}
                triggerFetch={triggerFetch}
            />

            <View style={{position: 'absolute', width: '100%', bottom: 0}}>

            <ButtonLottieAnimationSvg
                onPress={handleCalculate}
                preLabel=''
                label={`Calculate times`}
                height={54}
                radius={16}
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}
                labelFontSize={22}
                labelColor="white"
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true}
                showShape={true}
                shapePosition="right"
                shapeSource={CompassCuteSvg}
                shapeWidth={100}
                shapeHeight={100}
                shapePositionValue={-14}
                shapePositionValueVertical={-10}
                showIcon={false}
            />
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        paddingBottom: 160,
    },
    locationContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: 8,
    },
    locationTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    locationAddress: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
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
});

export default CompareTravel;
