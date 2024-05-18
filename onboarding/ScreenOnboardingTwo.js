import React, { useState, useEffect, useRef } from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';
import InputOnboarding from './InputOnboarding'; // Importing the custom input component
import { useFriendList } from '../context/FriendListContext'; // Importing useFriendList hook
import { fetchFriendList } from '../api'; // Importing the function to fetch the friend list

const ScreenOnboardingTwo = ({ onChange }) => {
    const navigation = useNavigation();
    const { friendList, setFriendList } = useFriendList(); // Accessing friendList from context
    const [friendName, setFriendName] = useState('');
    const inputRef = useRef(null); // Reference for the input field

    useEffect(() => { 
        inputRef.current.focus();
    }, []);

    const goToNextScreen = async () => { 
        try {
            // Fetch the updated friend list from the server
            const updatedFriendList = await fetchFriendList();
            console.log(updatedFriendList);
            // Check if the entered friend name already exists in the updated friend list
            const friendAlreadyExists = updatedFriendList.some(friend => friend.name === friendName.trim());
            if (friendAlreadyExists) {
                // Handle case where friend name already exists
                alert('This friend already exists. Please enter a different name.');
            } else {
                // If the friend name doesn't exist, navigate to the next screen
                navigation.navigate('Three');
                onChange(friendName);
            }
        } catch (error) {
            console.error('Failed to fetch friend list:', error);
            // Handle error fetching friend list (display error message, retry, etc.)
        }
    };

    const goToPrevScreen = () => {
        navigation.navigate('One');
    };

    const handleFriendNameChange = (text) => {
        setFriendName(text);
    };

    const handleSubmitEditing = () => {
        // Automatically navigate to the next screen when Enter is pressed
        goToNextScreen();
    };
 

    return (
        <View style={styles.container}>
            <View style={styles.content}> 
                <View style={styles.inputContainer}>
                    <Text style={styles.message}>Please enter your friend's name.</Text>
                    <InputOnboarding
                        inputRef={inputRef}
                        value={friendName}
                        onChangeText={handleFriendNameChange}
                        placeholder="Friend's Name"
                        maxLength={30} // Limit to 30 characters
                        onSubmitEditing={handleSubmitEditing}
                    />
                </View> 
            </View>
            <View style={styles.bottom}>
                <ButtonsOnboardingNav
                    showPrevButton={true}
                    showNextButton={friendName.trim().length > 0}
                    onPrevPress={goToPrevScreen}
                    onNextPress={goToNextScreen}
                    iconColor={friendName.trim().length > 0 ? 'hotpink' : 'gray'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        marginTop: 30,
        marginBottom: 30,
    },
    bottom: {
        paddingBottom: 20,
    },
    completeButtonContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    message: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    }, 
});

export default ScreenOnboardingTwo;
