import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { useNavigation } from '@react-navigation/native';  
import { FontAwesome } from '@expo/vector-icons'; 
import ButtonsOnboardingNav from './ButtonsOnboardingNav'; // Importing the navigation buttons component

const ScreenOnboardingFive = ({ onChange, onCategoryChange }) => {
    const navigation = useNavigation(); 
    const thoughtCapsuleInputRef = useRef(null); // Reference for the Thought Capsule input field
    const categoryInputRef = useRef(null); // Reference for the Category input field

    const [thoughtCapsule, setThoughtCapsule] = useState('');
    const [category, setCategory] = useState('');
    const [iconColor, setIconColor] = useState('gray'); // Initial color for the icon

    useEffect(() => {
        // Focus on the Thought Capsule input field when the component mounts
        thoughtCapsuleInputRef.current.focus();
    }, []);

    useEffect(() => {
        // Change the color of the icon based on whether both fields have text
        if (thoughtCapsule.trim() !== '' && category.trim() !== '') {
            setIconColor('hotpink');
        } else {
            setIconColor('gray');
        }
    }, [thoughtCapsule, category]);

    const handleThoughtCapsuleChange = (text) => {
        setThoughtCapsule(text);
        onChange(text);
    };

    const handleCategoryChange = (text) => {
        setCategory(text);
        onCategoryChange(text);
    };

    const handleKeyPress = (event) => {
        if (event.nativeEvent.key === 'Enter') {
            // Focus on the Category input field when the user presses Enter
            categoryInputRef.current.focus();
        }
    };

    const goToNextScreen = () => {
        navigation.navigate('Complete');  
    };

    const goToPrevScreen = () => {
        navigation.navigate('Four'); 
    };

    return (
        <>
            <View style={styles.container}> 
                <Text style={styles.message}>Please add one thought you would like to tell them later.</Text>
                <TextInput
                    ref={thoughtCapsuleInputRef} // Assign the ref to the Thought Capsule input field
                    style={styles.input}
                    placeholder="Thought Capsule"
                    onChangeText={handleThoughtCapsuleChange}
                    value={thoughtCapsule}
                    multiline
                    numberOfLines={4}
                    onKeyPress={handleKeyPress} // Call handleKeyPress when a key is pressed
                />
                <TextInput
                    ref={categoryInputRef} // Assign the ref to the Category input field
                    style={styles.input}
                    placeholder="Category"
                    onChangeText={handleCategoryChange}
                    value={category}
                />
                <ButtonsOnboardingNav
                    showPrevButton={true}
                    showNextButton={true}
                    onPrevPress={goToPrevScreen}
                    onNextPress={goToNextScreen}
                    iconColor={iconColor} // Passing the icon color
                />
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
        paddingHorizontal: 10,
    },
    footerContainer: { backgroundColor: '#333333' },
    message: {
        fontSize: 20,  
        textAlign: 'center',
        marginBottom: 20,  
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default ScreenOnboardingFive;
