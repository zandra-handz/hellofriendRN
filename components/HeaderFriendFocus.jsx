import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import FriendSelectModalVersionButtonOnly from './FriendSelectModalVersionButtonOnly';


import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const HeaderFriendFocus = () => {
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
                <LinearGradient
                    colors={[ themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerContainer}
                > 
                    <TouchableOpacity onPress={handleNavigateBack} style={styles.leftIcon}>
                        <ArrowLeftCircleOutline height={30} width={30} color={themeAheadOfLoading.fontColor} />
                    </TouchableOpacity>

                    <View style={styles.centerContainer}>
                        <Text
                            numberOfLines={1} 
                            style={[
                                styles.headerText, 
                                themeStyles.headerText, 
                                { color: themeAheadOfLoading.fontColorSecondary }
                            ]}
                        >
                            {`${selectedFriend ? selectedFriend.name : ''}`}
                        </Text>
                    </View>

                    <FriendSelectModalVersionButtonOnly width='20%' iconSize={40} includeLabel={false} style={styles.rightIcon} />
                </LinearGradient>
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
    },
    leftIcon: {
        width: '20%', // Adjust width as necessary
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1, // Use flex: 1 to allow centering
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Poppins-Regular',
        textTransform: 'uppercase',
        textAlign: 'center', // Center the text
    },
    rightIcon: {
        width: '20%', // Adjust width as necessary
        alignItems: 'flex-end',
    },
});

export default HeaderFriendFocus;
