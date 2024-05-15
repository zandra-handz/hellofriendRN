import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';
import InputOnboarding from './InputOnboarding'; // Importing the custom input component

const ScreenOnboardingTwo = ({ onChange }) => {
    const navigation = useNavigation();
    const [friendName, setFriendName] = useState('');
    const [isFocused, setIsFocused] = useState(false); // State to track focus

    const inputRef = useRef(null); // Reference for the input field

    useEffect(() => {
        // Focus the input field when the screen mounts
        inputRef.current.focus();
    }, []);

    const goToNextScreen = () => {
        navigation.navigate('Three');
        onChange(friendName);
    };

    const goToPrevScreen = () => {
        navigation.navigate('One');
    };

    const handleFriendNameChange = (text) => {
        setFriendName(text);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        marginTop: 80,
    },
    message: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    }, 
});

export default ScreenOnboardingTwo;
