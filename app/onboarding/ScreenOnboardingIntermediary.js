import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Spinner from '@/app/components/appwide/spinner/Spinner';
import AlertFullSize from '@/app/components/alerts/AlertFullSize';
import { useAuthUser } from '@/src/context/AuthUserContext';
import { createFriend, updateFriendSugSettings, saveThoughtCapsule } from '@/src/calls/api';

const ScreenOnboardingIntermediary = ({ finalizingData, resetFinalizingData }) => {
    const navigation = useNavigation();  
    const { authUserState  } = useAuthUser();
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        handleSaveData();
    }, []);

    const handleSaveData = async () => {
        try {
            setLoading(true);
            console.log('Intermediary data: ', finalizingData);
            const formattedDate = new Date(finalizingData.friendDate).toISOString().split('T')[0];
            const postData = {
                name: finalizingData.friendName,
                first_name: 'Add First Name', 
                last_name: 'Add Last Name', 
                first_meet_entered: formattedDate,
                friendEffort: finalizingData.friendEffort,
                friendPriority: finalizingData.friendPriority
            };
            console.log('postData: ', postData);
            const friendResponse = await createFriend(postData);
            console.log(friendResponse);
            await saveThoughtCapsule({
                user: authUserState.user.id,
                friend: friendResponse.id,  
                typed_category: finalizingData.category,
                capsule: finalizingData.thoughtCapsule,
            });

            
            await updateFriendSugSettings({
                user: authUserState.user.id,
                friend: friendResponse.id,  
                effort_required: finalizingData.friendEffort,
                priority_level: finalizingData.friendPriority,
            });

            setAlertType('success');
            setAlertMessage(`${finalizingData.friendName} has been added to your friend's list!`); // Modified success message
            setAlertVisible(true); 
            resetFinalizingData();  
        } catch (error) {
            console.error('Failed to save data:', error);
            setAlertType('error');
            setAlertMessage('Failed to save data. Please try again.');
            setAlertVisible(true); 
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setAlertVisible(false);
        if (alertType === 'success') {
            navigation.navigate('Complete'); 
        } else {
            navigation.goBack('ScreenOnboardingTwo');
        
        }
    };

    return (
        <View style={styles.container}>
            {loading && !alertVisible && <Spinner visible={true} />}
            <AlertFullSize
                visible={alertVisible}
                type={alertType}
                message={alertMessage}
                buttonText="OK"
                onPress={handleAlertClose}
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
    },
});

export default ScreenOnboardingIntermediary;
