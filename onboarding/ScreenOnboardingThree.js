import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { FontAwesome } from '@expo/vector-icons'; 

const ScreenOnboardingThree = ({ onEffortChange, onPriorityChange }) => {
    const navigation = useNavigation(); 
    const friendEffortInputRef = useRef(null);
    const friendPriorityInputRef = useRef(null); // Reference for the Friend's Priority input field

    const [friendEffort, setFriendEffort] = useState('');
    const [friendPriority, setFriendPriority] = useState('');
    const [iconColor, setIconColor] = useState('gray');

    useEffect(() => {
        friendEffortInputRef.current.focus();
    }, []);

    useEffect(() => {
        if (friendEffort !== '' && friendPriority !== '') {
            setIconColor('hotpink');
        } else {
            setIconColor('gray');
        }
    }, [friendEffort, friendPriority]);

    const goToNextScreen = () => {
        if (validateInput(friendEffort, friendPriority)) {
            navigation.navigate('Four');  
            onEffortChange(friendEffort);
            onPriorityChange(friendPriority);
        } else {
            alert('Please enter valid values for effort (1-5) and priority (1-3).');
        }
    };

    const validateInput = (effort, priority) => {
        const effortNumber = Number(effort);
        const priorityNumber = Number(priority);
        return (
            !isNaN(effortNumber) && 
            !isNaN(priorityNumber) && 
            effortNumber >= 1 && effortNumber <= 5 && 
            priorityNumber >= 1 && priorityNumber <= 3
        );
    };

    const goToPrevScreen = () => {
        navigation.navigate('Two'); 
    };

    const handleFriendEffortChange = (text) => {
        setFriendEffort(text);
    };

    const handleFriendEffortSubmit = () => {
        friendPriorityInputRef.current.focus(); // Focus on the Friend's Priority input field
    };

    const handleFriendPriorityChange = (text) => {
        setFriendPriority(text);
    };

    return (
        <>
            <View style={styles.container}> 
                <Text style={styles.message}>Enter friend's effort (1-5) and priority (1-3).</Text>
                <TextInput
                    ref={friendEffortInputRef}
                    style={styles.input}
                    placeholder="Friend's Effort"
                    onChangeText={handleFriendEffortChange}
                    value={friendEffort}
                    keyboardType="numeric"
                    onSubmitEditing={handleFriendEffortSubmit} // Call handleFriendEffortSubmit when the user presses enter
                />
                <TextInput
                    ref={friendPriorityInputRef} // Assign the ref to the Friend's Priority input field
                    style={styles.input}
                    placeholder="Friend's Priority"
                    onChangeText={handleFriendPriorityChange}
                    value={friendPriority}
                    keyboardType="numeric"
                />
                <View style={styles.buttonContainer}> 
                    <TouchableOpacity onPress={goToPrevScreen}>
                        <FontAwesome name="angle-left" size={34} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToNextScreen} style={[styles.button, { borderColor: iconColor }]}>
                        <FontAwesome name="angle-right" size={34} color={iconColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: { backgroundColor: '#333333' },
    message: {
        fontSize: 20,  
        textAlign: 'center',
        marginBottom: 20,  
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        borderWidth: 0,
        borderRadius: 5,
    },
});

export default ScreenOnboardingThree;
