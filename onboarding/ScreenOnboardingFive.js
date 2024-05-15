import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';
import InputOnboarding from './InputOnboarding'; // Importing the custom input component
import TextAreaOnboarding from './TextAreaOnboarding';


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

    const handleThoughtCapsuleBlur = () => {
        // Focus on the Category input field when the user leaves the Thought Capsule field
        categoryInputRef.current.focus();
    };

    const goToNextScreen = () => {
        navigation.navigate('Complete');  
    };

    const goToPrevScreen = () => {
        navigation.navigate('Four'); 
    };

    return (
        <View style={styles.container}> 
            <Text style={styles.title}></Text>
                <Text style={styles.message}>Please add one thought you would like to tell them later.</Text>
                <View style={styles.inputContainer}>
                    <TextAreaOnboarding
                        inputRef={thoughtCapsuleInputRef} // Use inputRef instead of ref
                        value={thoughtCapsule}
                        onChangeText={handleThoughtCapsuleChange}
                        placeholder="Thought Capsule" 
                        maxLength={500}
                        onBlur={handleThoughtCapsuleBlur} // Call handleThoughtCapsuleBlur when the input field loses focus
                    />
                </View>
                <View style={styles.inputContainer}>
                    <InputOnboarding
                        inputRef={categoryInputRef} // Use inputRef instead of ref
                        value={category}
                        onChangeText={handleCategoryChange}
                        placeholder="Category"
                        maxLength={50}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <ButtonsOnboardingNav
                        showPrevButton={true}
                        showNextButton={true}
                        onPrevPress={goToPrevScreen}
                        onNextPress={goToNextScreen}
                        iconColor={iconColor} // Passing the icon color
                    />
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    title: { 
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    message: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
    },
    message: {
        fontSize: 20,  
        textAlign: 'center',
        marginBottom: 20,  
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
    },
});

export default ScreenOnboardingFive;
