import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';
import SliderInputOnboarding from './SliderInputOnboarding'; // Importing the SliderInputOnboarding component
import MessageOnboardingNote from './MessageOnboardingNote'; // Importing the MessageOnboardingNote component
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { LinearGradient } from 'expo-linear-gradient'; 



const ScreenOnboardingThree = ({ onEffortChange, onPriorityChange }) => {
    const navigation = useNavigation();
    const friendEffortInputRef = useRef(null);
    const friendPriorityInputRef = useRef(null);
    const { themeStyles, gradientColors } = useGlobalStyle();
    const { darkColor, lightColor } = gradientColors;

    const [friendEffort, setFriendEffort] = useState(3); // Initialize with default values
    const [friendPriority, setFriendPriority] = useState(2);
    const [iconColor, setIconColor] = useState('gray');

    useEffect(() => {
        friendEffortInputRef.current?.focus(); // Use optional chaining to prevent errors if ref is null
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
            onEffortChange(friendEffort.toString()); // Convert to string if needed
            onPriorityChange(friendPriority.toString());
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
            effortNumber >= 1 &&
            effortNumber <= 5 &&
            priorityNumber >= 1 &&
            priorityNumber <= 3
        );
    };

    const goToPrevScreen = () => {
        navigation.navigate('Two');
    };

    return (

        <LinearGradient
        colors={[darkColor, lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, themeStyles.signinContainer]}
        >   
            <View style={styles.content}> 
                 
                <View style={styles.sliderContainer}>
                    <SliderInputOnboarding
                        value={friendEffort}
                        onValueChange={setFriendEffort}
                        min={1} // Minimum value allowed
                        max={5} // Maximum value allowed
                        messages={{
                            1: 'Little (check in twice a year)',
                            2: 'Casual (check in every 60-90 days)',
                            3: 'Moderate (check in every month)',
                            4: 'Concerted (check in every two weeks)',
                            5: 'A frankly tenacious amount (check in every few days)'
                        }}
                        label="2. Effort needed to maintain this friendship"
                    />
                </View>
 
                <View style={styles.sliderContainer}>
                    <SliderInputOnboarding
                        value={friendPriority}
                        onValueChange={setFriendPriority}
                        min={1} // Minimum value allowed
                        max={3} // Maximum value allowed
                        messages={{
                            1: 'High',
                            2: 'Medium',
                            3: 'Unworried'
                        }}
                        label="3. Priority given to this friendship"
                    />
                </View>

                <MessageOnboardingNote
                    firstValue="Choose carefully!"
                    secondValue="You cannot change these settings unless you are logging a meet up."
                    marginTop={0}
                    marginBottom={20}
                />
            </View>
            <View style={styles.footerContainer}>
                <ButtonsOnboardingNav
                    showPrevButton={true}
                    showNextButton={true}
                    onPrevPress={goToPrevScreen}
                    onNextPress={goToNextScreen}
                    iconColor={iconColor}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        paddingHorizontal: 10,
        height: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center', 
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    sliderContainer: {
        marginTop: 0,
        marginBottom: 60,
        width: '100%',
    },
    footerContainer: {
        bottom: 60,
        position: 'absolute',

    },
});

export default ScreenOnboardingThree;
