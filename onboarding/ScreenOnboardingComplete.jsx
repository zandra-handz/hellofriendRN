import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { useAuthUser } from '../context/AuthUserContext';
import { useNavigation } from '@react-navigation/native';  
import { createFriend, saveThoughtCapsule, updateAppSetup } from '../api'; // Import createFriend, saveThoughtCapsule, and updateAppSetup functions

const ScreenOnboardingComplete = ({ finalizingData }) => {
    const { authUserState, onSignOut } = useAuthUser();
    const navigation = useNavigation();  
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleCreateFriend(); // Automatically call handleCreateFriend when the page mounts
    }, []); // Empty dependency array ensures this effect runs only once

    const handleCreateFriend = async () => {
        try {
            setLoading(true);
            const formattedDate = new Date(finalizingData.friendDate).toISOString().split('T')[0];
            const postData = {
                name: finalizingData.friendName,
                first_name: 'John', // Dummy value for first name
                last_name: 'Doe', // Dummy value for last name
                first_meet_entered: formattedDate,
                friendEffort: finalizingData.friendEffort,
                friendPriority: finalizingData.friendPriority
            };
            const response = await createFriend(postData);
            console.log("create friend response: ", response);
            // Save thought capsule after creating the friend
            await handleSaveThoughtCapsule(response.id);
        } catch (error) {
            console.error('Failed to create friend:', error);
        } finally {
            setLoading(false);
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

    return (
        <>
            <View style={styles.container}> 
                <Text style={styles.message}>Great job {authUserState.user.username}! Your account is now ready to go!</Text>
                {/* Display the entered data  */} 
                <Text>Friend Name: {finalizingData.friendName}</Text>
                <Text>Friend Effort: {finalizingData.friendEffort}</Text>
                <Text>Friend Priority: {finalizingData.friendPriority}</Text>
                {/*<Text>Friend Date: {finalizingData.friendDate}</Text>*/}
                <Text>Thought Capsule: {finalizingData.thoughtCapsule}</Text>
                <Text>Category: {finalizingData.category}</Text> 
                <View style={styles.buttonContainer}>
                    <Button title="Go back" onPress={goToPrevScreen} /> 
                    <Button 
                        title="Finish" 
                        onPress={handleUpdateAppSetup} 
                        disabled={loading} 
                        loading={loading} 
                    />
                </View>

            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: { backgroundColor: '#333333' },
    message: {
        fontSize: 20, // Adjust font size as needed
        textAlign: 'center',
        marginBottom: 20, // Add some margin below the text
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
});

export default ScreenOnboardingComplete;
