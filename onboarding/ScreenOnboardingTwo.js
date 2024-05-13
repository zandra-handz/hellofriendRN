 
import { FontAwesome } from '@expo/vector-icons'; 


import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { useNavigation } from '@react-navigation/native'; 

const ScreenOnboardingTwo = ({ onChange }) => {
    const navigation = useNavigation(); // Initialize useNavigation
    const [friendName, setFriendName] = useState('');
    const [iconColor, setIconColor] = useState('gray'); // Initial color for the icon

    const goToNextScreen = () => {
        navigation.navigate('Three'); 
        onChange(friendName);
    };

    const goToPrevScreen = () => {
        navigation.navigate('One'); // Navigate to the 'One' screen
    };

    const handleFriendNameChange = (text) => {
        setFriendName(text);
        // Update icon color based on the presence of friend name
        setIconColor(text.length > 0 ? 'hotpink' : 'gray');
    };

    return (
        <View style={styles.container}> 
            <Text style={styles.message}>Enter your friend's name.</Text>
            <TextInput
                style={styles.input}
                placeholder="Friend's Name"
                onChangeText={handleFriendNameChange}
                value={friendName}
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20, // Add horizontal padding
    },
    footerContainer: { backgroundColor: '#333333' },
    message: {
        fontSize: 20, // Adjust font size as needed
        textAlign: 'center',
        marginBottom: 20, // Add some margin below the text
        fontFamily: 'Poppins-Regular',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontFamily: 'Poppins-Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 40,
    },
    button: {
        borderWidth: 0,
        borderRadius: 5,
    },
});

export default ScreenOnboardingTwo;
