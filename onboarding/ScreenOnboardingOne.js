import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'; 
import { useAuthUser } from '../context/AuthUserContext';
import { useNavigation } from '@react-navigation/native';  
import { FontAwesome } from '@expo/vector-icons'; 
import ButtonColorHighlight from '../components/ButtonColorHighlight';

const ScreenOnboardingOne = () => {
    const { authUserState, onSignOut } = useAuthUser();
    const navigation = useNavigation(); 

    const goToNextScreen = () => {
        navigation.navigate('Two'); 
    };

    const handleSignOutPress = () => {
        console.log("Sign Out button pressed");  
        onSignOut(); 
    };

    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Hi {authUserState.user.username}, thanks for signing up!</Text>
            <Text style={styles.message}></Text>
            <Text style={styles.message}>Please add your first friend to start using hellofriend.</Text>


            <View style={styles.buttonContainer}> 
                <TouchableOpacity>
                    <FontAwesome name="angle-left" size={34} color="lightgray" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToNextScreen}>
                    <FontAwesome name="angle-right" size={34} color="hotpink" />
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
        justifyContent: 'space-between', // Evenly distribute space between buttons
        width: '100%', // Take up 100% width of the container
        marginTop: 0,
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
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    }
});

export default ScreenOnboardingOne;
