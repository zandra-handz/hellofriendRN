import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';

import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import ButtonToggleSize from '../components/ButtonToggleSize'; // Adjust the path as needed
import AlertConfirm from '../components/AlertConfirm';
import AlertList from '../components/AlertList';
import AlertSuccessFail from '../components/AlertSuccessFail';

import LoadingPage from '../components/LoadingPage';

import ByeSvg from '../assets/svgs/bye.svg';
import { remixAllNextHelloes } from '../api'; // Ensure correct import
import RowItemFriend from '../components/RowItemFriend';

const ButtonManageFriends = ({ title, onPress, confirmationAlert = true }) => {
    const { setUpdateTrigger } = useUpcomingHelloes(); // Removed unused variables
    
    const { friendList, setFriendList, removeFromFriendList, updateFriend } = useFriendList();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    
    const [isAttemptingToRemix, setIsAttemptingToRemix] = useState(false);

    const { authUserState } = useAuthUser();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const friendTotal = friendList.length;

    const confirmResetHelloes = async () => { // Add 'async' keyword here
        try {
            setIsAttemptingToRemix(true);
            await remixAllNextHelloes(authUserState.user.id);
            setIsAttemptingToRemix(false);
            console.log('Reset hello dates button pressed!');
            setSuccessModalVisible(true);  
        } catch (error) {
            setIsAttemptingToRemix(false);
            setFailModalVisible(true);
            console.error('Error resetting hello dates:', error);
        } finally {
            setModalVisible(false);
        }
    };

    const successOk = () => {
        setUpdateTrigger(prev => !prev); 
        setSuccessModalVisible(false);
    };

    const failOk = () => { 
        setFailModalVisible(false);
    };

    return (
        <>
            <ButtonToggleSize
                title={title}
                onPress={toggleModal}
                iconName="list" // Custom icon for reset action
                style={{
                    backgroundColor: '#e63946', // Custom red color for the reset button
                    width: 70, // Adjust width as needed
                    height: 35, // Adjust height as needed
                    borderRadius: 20, // Adjust borderRadius for a more rounded appearance
                }}
            />
            {confirmationAlert && (
                <AlertList
                    fixedHeight={true}
                    height={700}
                    isModalVisible={isModalVisible}
                    isFetching={isAttemptingToRemix}
                    useSpinner={true}
                    toggleModal={toggleModal}
                    headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>Friends ({friendTotal}/20)</Text>}
                    content={
                        <FlatList
                            data={friendList}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <RowItemFriend
                                    friend={item}
                                    onRemove={removeFromFriendList}
                                    onUpdate={updateFriend}
                                />
                            )}
                        />
                    }
                    
                    onConfirm={confirmResetHelloes}
                    onCancel={toggleModal}
                    confirmText="Reset All"
                    cancelText="Done"
                />
            )}
            <AlertSuccessFail
                isVisible={isSuccessModalVisible}
                message='Helloes reset!'
                onClose={successOk}
                type='success'
            />

            <AlertSuccessFail
                isVisible={isFailModalVisible}
                message='Could not reset :('
                onClose={failOk}
                tryAgain={false}
                onRetry={confirmResetHelloes}
                isFetching={isAttemptingToRemix}
                type='failure'
            />

        
        </>
    );
};

export default ButtonManageFriends;
