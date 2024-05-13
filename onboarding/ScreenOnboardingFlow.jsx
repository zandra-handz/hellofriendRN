import React, { useState } from 'react';
import { useAuthUser } from '../context/AuthUserContext';
import { Button, View, StyleSheet } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter';
import ProgressBarOnboarding from '../components/ProgressBarOnboarding';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScreenOnboardingOne from './ScreenOnboardingOne';
import ScreenOnboardingTwo from './ScreenOnboardingTwo';
import ScreenOnboardingThree from './ScreenOnboardingThree';
import ScreenOnboardingFour from './ScreenOnboardingFour';
import ScreenOnboardingFive from './ScreenOnboardingFive';
import ScreenOnboardingComplete from './ScreenOnboardingComplete';

const Stack = createNativeStackNavigator();

const ScreenOnboardingFlow = () => {
    const [finalizingData, setFinalizingData] = useState({});
    
    const { authUserState, onSignOut } = useAuthUser();

    const handleSignOutPress = () => {
        console.log("Sign Out button pressed");  
        onSignOut(); 
    };

    const handleFriendNameChange = (friendName) => {
        setFinalizingData((prevData) => ({ ...prevData, friendName }));
    };
    
    const handleFriendEffortChange = (friendEffort) => {
        setFinalizingData((prevData) => ({ ...prevData, friendEffort }));
    };

    const handleFriendPriorityChange = (friendPriority) => {
        setFinalizingData((prevData) => ({ ...prevData, friendPriority }));
    };

    const handleFriendDateChange = (friendDate) => {
        console.log("Friend Date Updated:", friendDate); // Added console.log statement
        setFinalizingData((prevData) => ({ ...prevData, friendDate }));
    };

    const handleThoughtCapsuleChange = (thoughtCapsule) => {
        setFinalizingData((prevData) => ({ ...prevData, thoughtCapsule }));
    };

    const handleCategoryChange = (category) => {
        setFinalizingData((prevData) => ({ ...prevData, category }));
    };

    return (
        <>
            <Stack.Navigator>
                <Stack.Screen
                    name="One"
                    component={ScreenOnboardingOne} 
                    options={{
                        header: (props) => <ProgressBarOnboarding percentage={0.20} {...props} /> 
                    }}
                />
                <Stack.Screen
                    name="Two"
                    options={{
                        header: (props) => <ProgressBarOnboarding percentage={0.40} {...props} /> 
                    }}
                >
                    {(props) => <ScreenOnboardingTwo {...props} onChange={handleFriendNameChange} />}
                </Stack.Screen>
                <Stack.Screen
                    name="Three"
                    options={{
                        header: (props) => <ProgressBarOnboarding percentage={0.60} {...props} /> 
                    }}
                >
                    {(props) => (
                        <ScreenOnboardingThree
                            {...props}
                            onEffortChange={handleFriendEffortChange}
                            onPriorityChange={handleFriendPriorityChange}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Four"
                    options={{
                        header: (props) => <ProgressBarOnboarding percentage={0.80} {...props} /> 
                    }}
                >
                    {(props) => (
                        <ScreenOnboardingFour
                            {...props}
                            onChange={handleFriendDateChange}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Five"
                    options={{
                        header: (props) => <ProgressBarOnboarding percentage={0.90} {...props} /> 
                    }}
                >
                    {(props) => (
                        <ScreenOnboardingFive
                            {...props}
                            onChange={handleThoughtCapsuleChange}
                            onCategoryChange={handleCategoryChange}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Complete"
                    options={{
                        header: (props) => <ProgressBarOnboarding percentage={1} {...props} /> 
                    }}
                >
                    {(props) => (
                        <ScreenOnboardingComplete
                            {...props}
                            finalizingData={finalizingData} // Pass finalizingData as a prop
                        />
                    )}
                </Stack.Screen>

            </Stack.Navigator>
            <Button title="Exit" onPress={handleSignOutPress} /> 
            <View style={styles.footerContainer}>
                <HelloFriendFooter />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white',
    },
    progressBarContainer: {
        marginTop: 66,
    },
    footerContainer: { backgroundColor: '#333333' },
});

export default ScreenOnboardingFlow;
