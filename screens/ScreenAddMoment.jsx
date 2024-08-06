 

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ResultsMidpointFinds from '../components/ResultsMidpointFinds';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import ContentAddMoment from '../components/ContentAddMoment';

import { Picker } from '@react-native-picker/picker';

import ButtonReviewNewFriendDetails from '../components/ButtonReviewNewFriendDetails';


const ScreenAddMoment = ({includeBottomButton = false}) => { 
    const { authUserState } = useAuthUser();
    const { selectedFriend } = useAuthUser();
     
     

    return (
        <View style={styles.container}> 
            <View style={styles.mainContainer}> 
                <ContentAddMoment />
            </View>
            {includeBottomButton && ( 
            <View style={styles.bottomContainer}> 
                    <ButtonReviewNewFriendDetails />
            </View>
             )}
     
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    mainContainer: {
        flex: 1,
        paddingBottom: 10,
    },
    inputLabel: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginVertical: 10,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        color: 'black',
    },
    bottomContainer: {
        height: '12%', 
        padding: 0,
        paddingTop: 10,
        paddingHorizontal: 10,  
        position: 'absolute', 
        zIndex: 1,
        bottom: 0,
        right: 0,
        left: 0,
    
      },
});

export default ScreenAddMoment;
