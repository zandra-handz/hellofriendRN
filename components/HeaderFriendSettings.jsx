// colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
//start={{ x: 0, y: 0 }}
//end={{ x: 1, y: 0 }}

//HeaderFriendFocus is the same but with the user's custom colors
//(can't decide yet till I finish/see the rest of it)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import FriendSelectModalVersionButtonOnly from './FriendSelectModalVersionButtonOnly';
import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const HeaderFriendSettings = () => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    const { selectedFriend, loadingNewFriend } = useSelectedFriend();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack();  
    };

    return (
        <>
            {!loadingNewFriend && ( 
                <View
                    style={[styles.headerContainer, themeStyles.genericTextBackground]}
                     
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
                            {`${selectedFriend ? selectedFriend.name : ''}`}
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
        height: 100, // Adjust for device or build
        position: 'relative',
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

export default HeaderFriendSettings;
