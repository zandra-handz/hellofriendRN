// colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
//start={{ x: 0, y: 0 }}
//end={{ x: 1, y: 0 }}

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useFriendList } from '@/src/context/FriendListContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';  
import GearsTwoBiggerCircleSvg from '@/app/assets/svgs/gears-two-bigger-circle.svg';
import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg';
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
                    colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerContainer}
                > 
                    <TouchableOpacity onPress={handleNavigateBack} style={styles.leftIcon}>
                        <ArrowLeftCircleOutline height={30} width={30} color={themeAheadOfLoading.fontColor} />
                    </TouchableOpacity>

                    <View style={styles.centeredContainer}>
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

                    <View style={styles.rightIcon}>
                        <GearsTwoBiggerCircleSvg width={34} height={34} color={themeAheadOfLoading.fontColorSecondary} />
                    </View>
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

export default HeaderFriendFocus;
