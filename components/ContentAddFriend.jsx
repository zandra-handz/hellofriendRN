import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createFriend, updateFriendSugSettings } from '../api';

import InputAddFriendName from '../components/InputAddFriendName';
import SliderAddFriendEffort from '../components/SliderAddFriendEffort';
import SliderAddFriendPriority from '../components/SliderAddFriendPriority';
import PickerAddFriendLastDate from '../components/PickerAddFriendLastDate';
import ButtonMediumAddFriend from '../components/ButtonMediumAddFriend';
import MessagePage from '../components/MessagePage';
import AlertList from '../components/AlertList';
import AlertSuccessFail from '../components/AlertSuccessFail'; 

import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';


const ContentAddFriend = () => {
   
    const { authUserState } = useAuthUser();
    const { setUpdateTrigger } = useUpcomingHelloes();
    const { friendList, addToFriendList } = useFriendList();

    const navigation = useNavigation();

    const [friendName, setFriendName] = useState('');
    const [friendEffort, setFriendEffort] = useState(3);
    const [friendPriority, setFriendPriority] = useState(2);
    const [friendDate, setFriendDate] = useState(new Date());

    const [isFriendLimitReached, setIsFriendLimitReached] = useState(false);
    const [isFriendNameUnique, setIsFriendNameUnique] = useState(false);
    const [revealRest, setRevealRest] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    const [ saveInProgress, setSaveInProgress ] = useState(false);

    const [newFriendData] = useState({
        friendName: '',
        friendEffort: 3,
        friendPriority: 2,
        friendDate: new Date(),
    }); 
    
    const navigateToMainScreen = () => {
        navigation.navigate('hellofriend');
    };
    
    const toggleReviewModal = () => {
        setIsReviewModalVisible(!isReviewModalVisible);
    };

    useEffect(() => {
        if (friendList && friendList.length < 20) {
            setIsFriendLimitReached(false); 
        } else {
            setIsFriendLimitReached(true); 
        }
    }, [friendList]);


    const handleSave = async () => {
        try {
            setSaveInProgress(true); 
            const formattedDate = new Date(friendDate).toISOString().split('T')[0];
            const postData = {
                name: friendName,
                first_name: 'Add First Name', 
                last_name: 'Add Last Name', 
                first_meet_entered: formattedDate,
                friendEffort: friendEffort,
                friendPriority: friendPriority
            };
            console.log('postData: ', postData); 
            const friendResponse = await createFriend(postData);
            addToFriendList(friendResponse); 

 
            await updateFriendSugSettings({
                user: authUserState.user.id,
                friend: friendResponse.id,  
                effort_required: friendEffort,
                priority_level: friendPriority,
            }); 
 
            console.log(`${friendName} has been added to your friend's list!`); // Modified success message
            setSuccessModalVisible(true);
        } catch (error) { 
            console.error('Failed to save data:', error); 
            setFailModalVisible(true);
        } finally {
            setSaveInProgress(false);
            setIsReviewModalVisible(false);
        }
    };


    const successOk = () => {
        setUpdateTrigger(prev => !prev); 
        navigateToMainScreen();
        setSuccessModalVisible(false);
    };

    const failOk = () => { 
        setFailModalVisible(false);
    };



    return (
        <View style={styles.container}>
           {isFriendLimitReached && (
            <View style={{flex: 1, marginHorizontal: 30}}> 
                <MessagePage 
                    message="Sorry! You have already added the max amount of friends." 
                    includeBackground={true} 
                    backgroundColor="white"  
                    textColor="black"  
                    fontSize={20}  
                    />
            </View>
           )}
 
            {!isFriendLimitReached && (
             <>
             <InputAddFriendName
                friendName={friendName}
                setFriendName={setFriendName}
                isFriendNameUnique={isFriendNameUnique}
                setIsFriendNameUnique={setIsFriendNameUnique}
                setRevealRest={setRevealRest}
                friendList={friendList}
            /> 
             
                {revealRest && ( 
                <> 

                    <SliderAddFriendEffort
                        friendEffort={friendEffort}
                        setFriendEffort={setFriendEffort}
                    />

                    <SliderAddFriendPriority
                        friendPriority={friendPriority}
                        setFriendPriority={setFriendPriority}
                    />

                    <PickerAddFriendLastDate
                        friendDate={friendDate}
                        setFriendDate={setFriendDate}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                    />
                    <ButtonMediumAddFriend
                        friendName={friendName}
                        toggleReviewModal={toggleReviewModal}
                    />
                </>

                )}  
        </>
            )}
        <AlertList
            fixedHeight={true}
            height={700}
            isModalVisible={isReviewModalVisible} 
            isFetching={saveInProgress}
            useSpinner={true}
            toggleModal={toggleReviewModal}
            headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>Review</Text>}
            content={ 
                        <View> 
                            <Text>Friend data will go here</Text>
                        </View>
                 
            }
            
            onConfirm={handleSave}
            onCancel={toggleReviewModal}
            bothButtons={true}
            confirmText="Looks good!"
            cancelText="Go back"
        />
        <AlertSuccessFail
            isVisible={isSuccessModalVisible}
            message={`${friendName} has been added to friends!`}
            onClose={successOk}
            type='success'
        />

        <AlertSuccessFail
            isVisible={isFailModalVisible}
            message={`Could not add ${friendName} to friends.`}
            onClose={failOk}
            tryAgain={false}
            onRetry={handleSave}
            isFetching={saveInProgress}
            type='failure'
        />
   
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        flexDirection: 'column', 
        justifyContent: 'space-between',
        marginBottom: 0,
        
    }, 
});

export default ContentAddFriend;
