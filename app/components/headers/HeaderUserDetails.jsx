// colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
//start={{ x: 0, y: 0 }}
//end={{ x: 1, y: 0 }}

//HeaderFriendFocus is the same but with the user's custom colors
//(can't decide yet till I finish/see the rest of it)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; 
import { useAuthUser } from '@/src/context/AuthUserContext'; 
import GearsTwoBiggerCircleSvg from '@/app/assets/svgs/gears-two-bigger-circle.svg';
import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg';
import { useNavigation } from '@react-navigation/native'; 

const HeaderUserDetails = () => {
    const { themeStyles } = useGlobalStyle();  
    const navigation = useNavigation();
    const { authUserState } = useAuthUser();

    const handleNavigateBack = () => {
        navigation.goBack();  
    };

    return (
        <>
            {authUserState && authUserState.authenticated && authUserState.user && ( 
                <View
                    style={[styles.headerContainer, themeStyles.headerContainer]}
                     
                > 
                    <TouchableOpacity onPress={handleNavigateBack} style={styles.leftIcon}>
                        <ArrowLeftCircleOutline height={30} width={30} color={themeStyles.footerIcon.color} />
                    </TouchableOpacity>

                    <View style={styles.centeredContainer}>
                        <Text
                            numberOfLines={1} 
                            style={[
                                styles.headerText, 
                                themeStyles.headerText, 
                                { color: themeStyles.footerIcon.color }
                            ]}
                        >
                            {`${authUserState ? authUserState.user.username : ''}`}
                        </Text>
                    </View>

                    <View style={styles.rightIcon}>
                        <GearsTwoBiggerCircleSvg width={34} height={34} color={themeStyles.footerIcon.color} />
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        padding: 10,
        paddingTop: 56, // Adjust for device or build
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100, 
    },
    leftIcon: {
        width: '10%', // Adjust width as necessary
        alignItems: 'flex-start',
    },
    centeredContainer: {
        flex: 1, // Take up remaining space in the middle
        flexGrow: 1,
        alignItems: 'center',
        textAlign: 'center', 
        justifyContent: 'center',
        alignSelf: 'center', // Center within the header
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Poppins-Regular',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    rightIcon: {
        width: '10%', // Adjust width as necessary
        alignItems: 'flex-end',
    },
});

export default HeaderUserDetails;
