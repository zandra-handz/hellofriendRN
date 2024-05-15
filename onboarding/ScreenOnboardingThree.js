import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';
import SliderInputOnboarding from './SliderInputOnboarding'; // Importing the SliderInputOnboarding component
import MessageOnboardingNote from './MessageOnboardingNote'; // Importing the MessageOnboardingNote component

const ScreenOnboardingThree = ({ onEffortChange, onPriorityChange }) => {
    const navigation = useNavigation();
    const friendEffortInputRef = useRef(null);
    const friendPriorityInputRef = useRef(null);

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
        <View style={styles.container}>
            <View style={styles.content}> 
                
                {/* Container for friend's effort slider */}
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
                        label="Effort needed to maintain this friendship"
                    />
                </View>

                {/* Container for friend's priority slider */}
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
                        label="Priority given to this friendship"
                    />
                </View>

                <MessageOnboardingNote
                    firstValue="Choose carefully!"
                    secondValue="You cannot change these settings unless you are logging a meet up."
                    marginTop={0}
                    marginBottom={20}
                />
            </View>
            <View style={styles.bottom}>
                <ButtonsOnboardingNav
                    showPrevButton={true}
                    showNextButton={true}
                    onPrevPress={goToPrevScreen}
                    onNextPress={goToNextScreen}
                    iconColor={iconColor}
                />
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
        paddingHorizontal: 10,
        height: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    sliderContainer: {
        marginTop: 20,
        marginBottom: 70,
        width: '100%',
    },
    bottom: {
        paddingBottom: 20,
    },
});

export default ScreenOnboardingThree;
