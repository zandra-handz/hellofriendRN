import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';

import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg'; // Import the SVG
import FriendSelect from '../data/FriendSelect';
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import AlertList from '../components/AlertList';
import AlertSuccessFail from '../components/AlertSuccessFail';

import LoadingPage from '../components/LoadingPage';

import { useNavigation } from '@react-navigation/native';

 
 
const ContentAddMoment= ({ size = 14, family = 'Poppins-Regular', color = "black", style }) => {
   
    const { authUserState } = useAuthUser(); 
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

    
     
    
    
    const navigateToMainScreen = () => {
        navigation.navigate('hellofriend');

    };
    
 
 

    return (
        <View style={styles.container}> 
             <View style={styles.mainContainer}>
                <Text style={styles.locationTitle}>
                    Select or change friend
                </Text>
                <View style={styles.selectFriendContainer}>
                    <FriendSelectModalVersion />
                    
                </View> 
             </View> 

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
    selectFriendContainer: {
        top: 30,
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        marginVertical: 10,
        height: 40,
        backgroundColor: 'black',
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

export default ContentAddMoment;
