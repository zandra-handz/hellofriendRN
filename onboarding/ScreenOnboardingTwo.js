import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import ButtonsOnboardingNav from './ButtonsOnboardingNav'; // Importing the new navigation buttons component
import InputOnboarding from './InputOnboarding'; // Importing the InputOnboarding component

const ScreenOnboardingTwo = ({ onChange }) => {
    const navigation = useNavigation();
    const [friendName, setFriendName] = useState('');
    const [iconColor, setIconColor] = useState('gray');

    const goToNextScreen = () => {
        navigation.navigate('Three');
        onChange(friendName);
    };

    const goToPrevScreen = () => {
        navigation.navigate('One');
    };

    const handleFriendNameChange = (text) => {
        setFriendName(text);
        setIconColor(text.length > 0 ? 'hotpink' : 'gray');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Step One</Text>
            <Text style={styles.message}>Please enter your friend's name.</Text>
            {/* Replaced TextInput with InputOnboarding */}
            <InputOnboarding
                value={friendName}
                onChangeText={handleFriendNameChange}
                placeholder="Friend's Name"
                style={styles.input}
            />
            <ButtonsOnboardingNav
                showPrevButton={true}
                showNextButton={true}
                onPrevPress={goToPrevScreen}
                onNextPress={goToNextScreen}
                iconColor={iconColor}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
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
    }, 
});

export default ScreenOnboardingTwo;