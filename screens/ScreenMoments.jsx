import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import MomentsList from '../components/MomentsList';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonGoToAddMoment from '../components/ButtonGoToAddMoment';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFriendList } from '../context/FriendListContext';  

const ScreenMoments = ({ route, navigation }) => {
    const { themeAheadOfLoading } = useFriendList();
    const { themeStyles } = useGlobalStyle();  
    const { capsuleList } = useCapsuleList();  

    return ( 
        <LinearGradient
            colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container, themeStyles.signinContainer]}
        >
            
            <View style={{ flex: 1}}>
                {capsuleList && (
                        <MomentsList  /> 
                )}
                <ButtonGoToAddMoment />
               
            </View> 
        </LinearGradient> 
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        width: '101%',
        left: -1,  
        padding: 0,
        justifyContent: 'space-between',
    },
});

export default ScreenMoments;
