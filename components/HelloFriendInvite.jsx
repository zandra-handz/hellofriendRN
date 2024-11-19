import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Linking } from 'react-native';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg'; 

import { useAuthUser } from '../context/AuthUserContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import CardHoursAsButtons from '../components/CardHoursAsButtons';

const HelloFriendInvite = () => {
    const { selectedLocation } = useLocationFunctions();
    const { authUserState } = useAuthUser();
    const [message, setMessage] = useState('');
    const [editedMessage, setEditedMessage] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [hoursForDay, setHoursForDay] = useState('');

    useEffect(() => {
        if (selectedLocation && selectedLocation.address) {
            const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`;
            setMessage(directionsLink); // Set the directions link
            setEditedMessage(`${authUserState.user.username} has sent you a meet up site from the hellofriend app!`); // Default message for editing
        } else {
            setMessage('Directions not available.');
            setEditedMessage('Plan details are not available.');
        }
    }, [selectedLocation]);

    const handleDaySelect = (day, hours) => {
        setSelectedDay(day);
        setHoursForDay(hours);
    };

    const handleSend = () => {
        // Create the final message with the editedMessage at the front
        const finalMessage = `${editedMessage} On ${selectedDay}, ${selectedLocation?.title} is open ${hoursForDay}. Here are directions: ${message}`;
         
        Linking.openURL(`sms:?body=${encodeURIComponent(finalMessage)}`);
    };

    return (
        <View style={styles.container}> 
            <View style={styles.locationContainer}>
                <Text style={styles.locationTitle}>{selectedLocation?.title}</Text>
                <Text style={styles.locationAddress}>{selectedLocation?.address}</Text>
            </View>

            <View style={styles.cardContainer}>
                <CardHoursAsButtons onDaySelect={handleDaySelect} />
            </View>

            <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Message</Text>
                <TextInput
                    style={styles.textInput}
                    value={editedMessage}
                    onChangeText={setEditedMessage}
                    multiline
                />
            </View>

            <ButtonBottomActionBase
                onPress={handleSend}
                preLabel=''
                label={`Send this Location`}
                height={54}
                radius={16}
                fontMargin={3} 
                labelFontSize={22}
                labelColor="white" 
                labelContainerMarginHorizontal={4} 
                showGradient={true}
                showShape={true}
                shapePosition="right"
                shapeSource={CompassCuteSvg}
                shapeWidth={100}
                shapeHeight={100}
                shapePositionValue={-14}
                shapePositionValueVertical={-10} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
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

export default HelloFriendInvite;
