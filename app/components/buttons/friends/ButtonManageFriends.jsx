import React, { useState } from 'react';
import { FlatList,   Text  } from 'react-native';
 
import { useUpcomingHelloes } from '@/src/context/UpcomingHelloesContext';

import { useUser } from '@/src/context/UserContext';
import { useFriendList } from '@/src/context/FriendListContext';
import ButtonToggleSize from '../scaffolding/ButtonToggleSize'; 
import AlertList from '../../alerts/AlertList';
import AlertSuccessFail from '../../alerts/AlertSuccessFail';
  
import { remixAllNextHelloes } from '@/src/calls/api'; 
import RowItemFriend from '@/app/components/friends/RowItemFriend';

const ButtonManageFriends = ({ title, onPress, confirmationAlert = true }) => {
    const { setUpdateTrigger } = useUpcomingHelloes(); // Removed unused variables
    
    const { friendList, setFriendList, removeFromFriendList, updateFriend } = useFriendList();
    const [isModalVisible, setModalVisible] = useState(false);
    
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    
    const [isAttemptingToRemix, setIsAttemptingToRemix] = useState(false);

    const { user } = useUser();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const friendTotal = friendList.length;

    const confirmResetHelloes = async () => { // Add 'async' keyword here
        try {
            setIsAttemptingToRemix(true);
            await remixAllNextHelloes(user.user.id);
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
