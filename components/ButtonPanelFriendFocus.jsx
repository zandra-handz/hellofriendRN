import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';
import PushPinOutlineSvg from '../assets/svgs/push-pin-outline';
import LocationHeartOutlineSvg from '../assets/svgs/location-heart-outline';
import PhotoSolidSvg from '../assets/svgs/photo-solid';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline';

import { useNavigation } from '@react-navigation/native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonPanelFriendFocus = () => {

    const { calculatedThemeColors } = useSelectedFriend();
    const { themeStyles } = useGlobalStyle();
    const navigation = useNavigation();


    const navigateToHelloesScreen = () => {
        navigation.navigate('Helloes'); 
      };

      const navigateToMomentsScreen = () => {
        navigation.navigate('Moments'); 
      };

      const navigateToImagesScreen = () => {
        navigation.navigate('Images'); 
      };

      const navigateToLocationsScreen = () => {
        navigation.navigate('Locations'); 
      };


 

 


    return(
        <View style={styles.container}>
            <View style={styles.section}>
                <>
                <TouchableOpacity onPress={navigateToHelloesScreen} style={[styles.button, {backgroundColor: calculatedThemeColors.lightColor}]}>
                    <PhoneChatMessageHeartSvg height={34} width={34} color={calculatedThemeColors.fontColorSecondary} />
                </TouchableOpacity>
                <View><Text style={[styles.labelText, {color: calculatedThemeColors.fontColor}]}>helloes</Text></View> 
                
                </>
            </View>
            <View style={styles.section}>
                <>
                <TouchableOpacity onPress={navigateToLocationsScreen} style={[styles.button, {backgroundColor: calculatedThemeColors.lightColor}]}>
                    <LocationHeartOutlineSvg height={30} width={30} color={calculatedThemeColors.fontColorSecondary} />
                </TouchableOpacity> 
                <View><Text style={[styles.labelText, {color: calculatedThemeColors.fontColor}]}>locals</Text></View> 
                
                </>
            </View>
            <View style={styles.section}>
                <TouchableOpacity onPress={navigateToImagesScreen} style={[styles.button, {backgroundColor: calculatedThemeColors.lightColor}]}>
                    <PhotoSolidSvg height={28} width={28} color={calculatedThemeColors.fontColorSecondary} />
                </TouchableOpacity> 
                <View><Text style={[styles.labelText, {color: calculatedThemeColors.fontColor}]}>pics</Text></View> 
                
            </View>
            <View style={styles.section}>
                <TouchableOpacity onPress={navigateToMomentsScreen} style={[styles.button, {backgroundColor: calculatedThemeColors.lightColor}]}>
                    <ThoughtBubbleOutlineSvg height={32} width={32} color={calculatedThemeColors.fontColorSecondary} />
                </TouchableOpacity>
                <View><Text style={[styles.labelText, {color: calculatedThemeColors.fontColor}]}>momes</Text></View> 
                 
            </View>




        </View>

    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end', 

        width: '100%',
        padding: 0,
        borderRadius: 2, 
    },
    section: {  
        width: 64,
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
        
        flexDirection: 'column',
    },
    divider: { 
        marginVertical: 6,
    },
    button: {
         
        width: 50,
        backgroundColor: 'black',
        borderRadius: 12,
        height: 64,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3,

    },
    labelText: {
        textTransform: 'uppercase',
        fontFamily: 'Poppins-Bold',
        fontSize: 11,

    },

});

export default ButtonPanelFriendFocus;