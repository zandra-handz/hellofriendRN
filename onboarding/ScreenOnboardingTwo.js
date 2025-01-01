import React, { useState, useEffect, useRef } from 'react';
import { Text, Button, View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';
import InputOnboarding from './InputOnboarding'; // Importing the custom input component
import { useFriendList } from '../context/FriendListContext'; // Importing useFriendList hook
import { fetchFriendList } from '../api'; // Importing the function to fetch the friend list
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { LinearGradient } from 'expo-linear-gradient'; 


const ScreenOnboardingTwo = ({ onChange }) => {
    const { themeStyles, manualGradientColors } = useGlobalStyle(); 
    const navigation = useNavigation();
    const { friendList, setFriendList } = useFriendList(); // Accessing friendList from context
    const [friendName, setFriendName] = useState('');
    const inputRef = useRef(null); // Reference for the input field



    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500); // Add a slight delay to ensure the component is rendered
    
        return () => clearTimeout(timer); // Cleanup the timer on unmount
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


        <LinearGradient
        colors={[ manualGradientColors.darkColor,  manualGradientColors.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, themeStyles.signinContainer]}
        >  
            <View style={[styles.inputContainer, {backgroundColor: 'transparent'}]}>
                    <View>
                    <Text style={styles.message}>1. Please enter the name of a friend you'd like to add.</Text>
                    <InputOnboarding
                        inputRef={inputRef}
                        value={friendName}
                        onChangeText={handleFriendNameChange}
                        
                        placeholder="Name"
                        maxLength={30} // Limit to 30 characters
                        onSubmitEditing={handleSubmitEditing}
                    />  
                    
                        
                    </View>


            </View> 
          
            <View style={styles.footerContainer}>
            <ButtonsOnboardingNav
                    showPrevButton={true}
                    showNextButton={friendName.trim().length > 0}
                    onPrevPress={goToPrevScreen}
                    onNextPress={goToNextScreen}
                    iconColor={friendName.trim().length > 0 ? 'hotpink' : 'gray'}
                    /> 
 
            </View>


        </LinearGradient>
 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,   
        width: '100%',   
        height: '100%',
    },

    inputContainer: {
        paddingTop: 20, 
        width: '100%',  
    }, 
    completeButtonContainer: {
        alignItems: 'center',
        width: '100%', 
    },
    footerContainer: {
        bottom: 60,
        position: 'absolute',

    },
    message: {
        fontSize: 20,
        textAlign: 'left',
        paddingBottom: 20,
        paddingHorizontal: 10,
        fontFamily: 'Poppins-Regular',
    }, 
});

export default ScreenOnboardingTwo;
