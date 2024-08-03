import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useAuthUser } from '../context/AuthUserContext';
import ButtonToggleSize from '../components/ButtonToggleSize'; // Adjust the path as needed
import AlertConfirm from '../components/AlertConfirm';
import AlertSuccessFail from '../components/AlertSuccessFail';

import LoadingPage from '../components/LoadingPage';
import ByeSvg from '../assets/svgs/bye.svg';
import { remixAllNextHelloes } from '../api'; // Ensure correct import

const ButtonResetHelloes = ({ title, onPress, confirmationAlert = true }) => {
    const { setUpdateTrigger } = useUpcomingHelloes(); // Removed unused variables
    const [isModalVisible, setModalVisible] = useState(false);
    
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    
    const [isAttemptingToRemix, setIsAttemptingToRemix] = useState(false);

    const { authUserState } = useAuthUser();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

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
                iconName="refresh" // Custom icon for reset action
                style={{
                    backgroundColor: '#e63946', // Custom red color for the reset button
                    width: 70, // Adjust width as needed
                    height: 35, // Adjust height as needed
                    borderRadius: 20, // Adjust borderRadius for a more rounded appearance
                }}
            />
            {confirmationAlert && (
                <AlertConfirm
                    fixedHeight={true}
                    height={330}
                    isModalVisible={isModalVisible}
                    isFetching={isAttemptingToRemix}
                    useSpinner={true}
                    toggleModal={toggleModal}
                    headerContent={<ByeSvg width={36} height={36} />}
                    questionText="Reset all hello dates? (This can't be reversed!)"
                    onConfirm={confirmResetHelloes}
                    onCancel={toggleModal}
                    confirmText="Reset All"
                    cancelText="Nevermind"
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

export default ButtonResetHelloes;
