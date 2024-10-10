import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CardMicroLocation from '../components/CardMicroLocation';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import { FlashList } from '@shopify/flash-list';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';

import ButtonLocation from '../components/ButtonLocation';  

const ItemLocationFaveMulti = ({ 
    horizontal = true,
    singleLineScroll = false,
    width = 70,
    height = 70,
    columns = 3, 
    showBigSvg = false, 
}) => {
    const { themeStyles } = useGlobalStyle();
    const { calculatedThemeColors, friendDashboardData } = useSelectedFriend();
    const { locationList, faveLocationList, setSelectedLocation, populateFaveLocationsList } = useLocationList();
    
    const [isFaveLocationReady, setIsFaveLocationReady] = useState(false);

    useEffect(() => {
        if (friendDashboardData && friendDashboardData.length > 0) {
            const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations || [];
            populateFaveLocationsList(favoriteLocationIds);
            setIsFaveLocationReady(true);
        }
    }, [locationList, friendDashboardData]);

    const openModal = (location) => {
        setSelectedLocation(location);
        console.log('setting location in ItemLocationFaveMulti'); 
    };



  

    return (
        <View style={[styles.container]}>
            {isFaveLocationReady && faveLocationList.length > 0 && (
            <>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>Favorites</Text>
            <FlashList
                data={faveLocationList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                    <>
                   
                    {!horizontal && (
                    <ButtonLocation 
                        location={location}    
                        onPress={() => openModal(location)} 
                        iconColor={calculatedThemeColors.darkColor}
                        color={themeStyles.genericText.color}
                        icon={LocationHeartSolidSvg} />
                    )}
                    </>
                )}
                numColumns={horizontal && !singleLineScroll ? columns : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                estimatedItemSize={99}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ right: 1 }}
            />


            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {  
        width: '100%',
        paddingHorizontal: 2, 
        minHeight: 2, 
        height: '100%',
    },
    headerText: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginTop: 4,
        marginBottom: 6,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageRow: {
        justifyContent: 'space-between',
    }, 
});

export default ItemLocationFaveMulti;
