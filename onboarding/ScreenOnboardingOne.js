import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native'; 
import { useAuthUser } from '../context/AuthUserContext';
import { useNavigation } from '@react-navigation/native';  
import { FontAwesome } from '@expo/vector-icons'; 
import ButtonColorHighlight from '../components/ButtonColorHighlight';
import AlertPopUp from '../components/AlertPopUp'; // Import AlertPopUp component

const PulsatingArrow = () => {
    const pulseAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.2,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };
        pulse();
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
            <FontAwesome name="angle-right" size={46} color="hotpink" />
        </Animated.View>
    );
};

const ScreenOnboardingOne = ({ messageContent }) => { // Receive messageContent as props
    const { authUserState } = useAuthUser();
    const navigation = useNavigation(); 
    const [showAlert, setShowAlert] = useState(false); // State for alert visibility
    const [alertType, setAlertType] = useState('success'); // State for alert type

    const goToNextScreen = () => {
        navigation.navigate('Two'); 
    };

    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Hi {authUserState.user.username}!</Text>
            <Text style={styles.message}>{messageContent}</Text> 
            
            <View style={styles.buttonContainer}> 
                <TouchableOpacity onPress={goToNextScreen}>
                    <PulsatingArrow />
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20, // Add horizontal padding
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'flex-end', // Align button to the right
        width: '100%', // Take up 100% width of the container
        marginTop: 0,
    },
    alertButton: {
        marginTop: 20,
        padding: 16,
        borderColor: '#1E90FF',
        borderBlockEndColor: '#39f0df',
        borderBlockStartColor: '#39f0df',
        borderWidth: 2,
        backgroundColor: 'black', // Darker sky blue color with slight purplish tint
        borderRadius: 30, // Border radius of 18
    },
    alertButtonText: {
        color: 'white',
    },
    footerContainer: { backgroundColor: '#333333' },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    message: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
});

export default ScreenOnboardingOne;
