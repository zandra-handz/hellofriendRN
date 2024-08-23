import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg'; // Import the SVG
import PickerDate from '../components/PickerDate';
import moment from 'moment';

import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';

import AlertList from '../components/AlertList';
import AlertSuccessFail from '../components/AlertSuccessFail';
 
import { useNavigation } from '@react-navigation/native';

 

import SliderInputOnboarding from '../onboarding/SliderInputOnboarding'; 
import { createFriend, updateFriendSugSettings } from '../api';


const ContentAddFriend = ({ size = 14, family = 'Poppins-Regular', color = "black", style }) => {
   
    const { authUserState } = useAuthUser();
    const { setUpdateTrigger } = useUpcomingHelloes(); // Removed unused variables
    const { friendList, addToFriendList } = useFriendList();
    const [isFriendLimitReached, setIsFriendLimitReached] = useState(false);
    const [ isFriendNameUnique, setIsFriendNameUnique ] = useState(false);
    const [ isReviewModalVisible, setIsReviewModalVisible ] = useState(false);
    const [ revealRest, setRevealRest ] = useState(false);
    const [testMessage, setTestMessage ] = useState('');
    const [nextButtonColor, setNextButtonColor] = useState('gray');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [ canSubmit, setCanSubmit ] = useState(false);
    
    const [ saveInProgress, setSaveInProgress ] = useState(false);
    
    const [friendName, setFriendName] = useState('');
    const [friendEffort, setFriendEffort] = useState(3);
    const [friendPriority, setFriendPriority] = useState(2);
    const [friendDate, setFriendDate] = useState(new Date());
    const [momentText, setMomentText] = useState('');
    const [momentCategory, setMomentCategory] = useState('');

    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    
    const navigation = useNavigation();

    const [newFriendData, setNewFriendData] = useState({
        friendName: '',
        friendEffort: 3,
        friendPriority: 2,
        friendDate: new Date(),
    });

    const collectFriendData = () => {
        const data = [
            { label: 'Name', value: friendName },
            { label: 'Effort', value: friendEffort.toString() },
            { label: 'Priority', value: friendPriority.toString() },
            { label: 'Last Contacted', value: moment(friendDate).format('YYYY-MM-DD') }, // Keep the date format if needed
        ];
    
        setNewFriendData(data);
    };

    const friendTotal = friendList.length;
    
    

    const friendNameRef = useRef(null);
    const effortRef = useRef(null); 
    
    const navigateToMainScreen = () => {
        navigation.navigate('hellofriend');

    };
    
    
    const toggleReviewModal = () => {
        setIsReviewModalVisible(!isReviewModalVisible);
    };


    const setVisibility = () => {
        if (isFriendNameUnique) {
            setRevealRest(true);
            console.log(revealRest); 
        }

    };

    useEffect(() => {
        if (friendList && friendList.length < 20) {
            setIsFriendLimitReached(false);
            setTestMessage('Space left to add more friends!');
        } else {
            setIsFriendLimitReached(true);
            setTestMessage('You have already added the max amount of friends.');
        }
    }, [friendList]);



    const handleFriendNameChange = (text) => {

        setFriendName(text);

        const isUnique = !friendList.some(friend => friend.name.toLowerCase() === text.toLowerCase());

        if (isUnique && text.length) {
            setIsFriendNameUnique(true);
            console.log('The value is unique.');

        } else {
            setIsFriendNameUnique(false);
            setRevealRest(false); 
            console.log('The value is already in the friend list.');
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || friendDate;
        setShowDatePicker(false);

        const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        setFriendDate(dateWithoutTime);
        console.log(dateWithoutTime);
        setNextButtonColor('hotpink');
    };

    useEffect(() => {
        console.log(revealRest);
        if (isFriendNameUnique && revealRest && effortRef.current) { 
            effortRef.current.focus();
        };

    }, [revealRest]);

    useEffect(() => {
        if (friendDate) {
            setCanSubmit(true);
            console.log('Friend date: ', friendDate);
        }
        
    }, [friendDate]); 

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
            console.log(friendResponse);


            // This will update the Next Meet as well
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
             <>
            <View style={styles.mainContainer}> 
                
                <View style={styles.locationContainer}>
                    <Text style={styles.locationTitle}>
                        Enter friend's name
                    </Text>
                    <View style={styles.inputContainer}>
                    <TextInput
                        ref={friendNameRef}
                        style={styles.textInput}
                        value={friendName}
                        placeholder="Name" 
                        onChangeText={handleFriendNameChange}
                        onSubmitEditing={setVisibility}
                            
                        />
                    </View>
                </View>
                {isFriendNameUnique && revealRest && ( 
                <> 

                <View style={styles.locationContainer}>
                    <Text style={styles.locationTitle}>
                        Effort needed to maintain friendship
                    </Text>
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
                        />
                </View>

                <View style={styles.locationContainer}>
                    <Text style={styles.locationTitle}>
                        Priority placed on friendship
                    </Text>
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
                        />
                </View>

                <View style={styles.locationContainer}> 
                    <PickerDate
                        value={friendDate}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={onChangeDate}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        dateTextStyle={styles.dateText}
                        containerStyle={styles.locationContainer}
                        labelStyle={styles.locationTitle}
                        buttonStyle={styles.datePickerButton}
                    />

                </View>
                </>
                )} 
            </View> 
            {isFriendNameUnique && revealRest && canSubmit && ( 
                <View style={styles.bottomButtonContainer}>  
                    <ButtonLottieAnimationSvg
                        onPress={toggleReviewModal}
                        preLabel=''
                        label={`Add ${friendName} To Friends`}
                        height={54}
                        radius={16}
                        fontMargin={3}
                        animationSource={require("../assets/anims/heartinglobe.json")}
                        rightSideAnimation={false}
                        labelFontSize={22}
                        labelColor="white"
                        animationWidth={234}
                        animationHeight={234}
                        labelContainerMarginHorizontal={4}
                        animationMargin={-64}
                        showGradient={true}
                        showShape={true}
                        shapePosition="right"
                        shapeSource={CompassCuteSvg}
                        shapeWidth={100}
                        shapeHeight={100}
                        shapePositionValue={-14}
                        shapePositionValueVertical={-10}
                        showIcon={false}
                    />
            </View> 
            )}
           
        </>
        <AlertList
            fixedHeight={true}
            height={700}
            isModalVisible={isReviewModalVisible} 
            isFetching={saveInProgress}
            useSpinner={true}
            toggleModal={toggleReviewModal}
            headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>Review</Text>}
            content={
                <FlatList
                    data={newFriendData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.rowItem}>
                            <Text style={styles.rowLabel}>{item.label}:</Text>
                            <Text>{item.value}</Text>
                        </View>
                    )}
                />
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
        justifyContent: 'space-between',
    },
    mainContainer: {
        flex: 1,
        padding: 0,
        justifyContent: 'space-between',
        paddingBottom: 68,

    },
    locationContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: 8,
    },
    locationTitle: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
    },
    locationAddress: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    cardContainer: {
        marginVertical: 10,
    },
    previewContainer: {
        marginVertical: 10,
    },
    previewTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        marginBottom: 5,
    },
    inputContainer: {
       
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 18,
        padding: 10,
        borderRadius: 20,
        fontFamily: 'Poppins-Regular',
        
    },
    dateText: { 
        fontSize: 16,
        marginVertical: 14,
        fontFamily: 'Poppins-Bold',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 20,
    },
    bottomButtonContainer: {
        height: '12%', 
        padding: 0,
        paddingTop: 40,
        paddingHorizontal: 10,  
        position: 'absolute', 
        zIndex: 1,
        bottom: 0,
        right: 0,
        left: 0,

    },
});

export default ContentAddFriend;
