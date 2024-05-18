import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import { createFriend, saveThoughtCapsule, updateAppSetup } from '../api';
import AlertPopUp from '../components/AlertPopUp';
import Spinner from '../components/Spinner';
import { useAuthUser } from '../context/AuthUserContext';
import ButtonColorHighlight from '../components/ButtonColorHighlight'; // Importing the ButtonColorHighlight component

const ScreenOnboardingComplete = ({ finalizingData, resetFinalizingData }) => {
    const { authUserState, onSignOut } = useAuthUser();
    const navigation = useNavigation();  
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        handleCreateFriend(); 
    }, []); 

    const handleCreateFriend = async () => {
        try {
            setLoading(true);
            const formattedDate = new Date(finalizingData.friendDate).toISOString().split('T')[0];
            const postData = {
                name: finalizingData.friendName,
                first_name: 'John', 
                last_name: 'Doe', 
                first_meet_entered: formattedDate,
                friendEffort: finalizingData.friendEffort,
                friendPriority: finalizingData.friendPriority
            };
            const response = await createFriend(postData);
            console.log("create friend response: ", response);
            await handleSaveThoughtCapsule(response.id);
            setAlertType('success');
            setAlertMessage('Friend has been saved successfully!');
            resetFinalizingData(); // Reset finalizingData after friend is saved
        } catch (error) {
            console.error('Failed to create friend:', error);
            setAlertType('error');
            setAlertMessage('Failed to save the friend. Please try again.');
        } finally {
            setLoading(false);
            setAlertVisible(true);
        }
    };

    const handleSaveThoughtCapsule = async (friendId) => {
        try {
            const requestData = {
                user: authUserState.user.id,
                friend: friendId,  
                typed_category: finalizingData.category,
                capsule: finalizingData.thoughtCapsule,
            };
            await saveThoughtCapsule(requestData);
            
        } catch (error) {
            console.error('Failed to save thought capsule:', error);
        }
    };

    const handleUpdateAppSetup = async () => {
        try {
            setLoading(true);
            await updateAppSetup();
            console.log('App setup updated successfully');
            onSignOut();
        } catch (error) {
            console.error('Failed to update app setup:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPrevScreen = () => {
        navigation.navigate('Four');  
    };

    const goToPageTwo = () => {
        resetFinalizingData(); // Reset finalizingData
        navigation.navigate('Two');  
    };

    const retrySaveFriend = () => {
        setAlertVisible(false);
        handleCreateFriend();
    };

    return (
        <>
            <View style={styles.container}> 
                <Text style={styles.message}>Great job {authUserState.user.username}! Your account is now ready to go!</Text>
                
                <View style={styles.buttonContainer}>
                    <ButtonColorHighlight onPress={goToPageTwo} title="Add Another Friend" />
                    <ButtonColorHighlight
                        onPress={handleUpdateAppSetup}
                        title="Finish"
                        disabled={loading}
                    />
                </View>

                {loading && (
                    <View style={styles.spinnerContainer}>
                        <Spinner />
                    </View>
                )}

                <AlertPopUp 
                    visible={alertVisible} 
                    type={alertType} 
                    message={alertMessage} 
                    buttonText="Close" 
                    onPress={() => setAlertVisible(false)} 
                    secondButtonText={alertType === 'error' ? 'Retry' : null}
                    onSecondButtonPress={alertType === 'error' ? retrySaveFriend : null}
                />
                {alertType === 'error' && (
                    <AlertPopUp 
                        visible={alertVisible} 
                        type={alertType} 
                        message={alertMessage} 
                        buttonText="Start Over" 
                        onPress={goToPageTwo} // Change to goToPageTwo
                        secondButtonText="Retry"
                        onSecondButtonPress={retrySaveFriend}
                    />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusted alignment
        width: '100%',
        marginTop: 20, // Adjusted margin
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
    },
    spinnerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1,
    },
});

export default ScreenOnboardingComplete;
