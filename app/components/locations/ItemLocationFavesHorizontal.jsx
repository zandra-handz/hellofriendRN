import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list'; 
import LocationHeartSolidSvg from '@/app/assets/svgs/location-heart-solid.svg';

import ItemViewLocation from '../components/ItemViewLocation';
import { useLocationList } from '@/src/context/LocationListContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const ItemLocationFavesHorizontal = ({ containerWidth=260, width = 160, height = 160 }) => {
    const { themeStyles } = useGlobalStyle();
    const { friendDashboardData } = useSelectedFriend();
    const { locationList, faveLocationList, populateFaveLocationsList } = useLocationList();
    const [isFaveLocationReady, setIsFaveLocationReady] = useState(false);

    useEffect(() => {
        if (friendDashboardData && friendDashboardData.length > 0) {
            const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations || [];
            populateFaveLocationsList(favoriteLocationIds);
            setIsFaveLocationReady(true);
        }
    }, [locationList, friendDashboardData]);

    const [selectNewLocation, setSelectNewLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = (location) => {
        setSelectNewLocation(location);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectNewLocation(null);
        setIsModalVisible(false);
    };
 
 
    return (
        <View style={[styles.container, {width: containerWidth}]}>
            {isFaveLocationReady && faveLocationList.length > 0 && (
            
            <FlashList
            data={faveLocationList}
            horizontal
            keyExtractor={(location) => location.id.toString()}
            renderItem={({ item: location }) => (
                <TouchableOpacity onPress={() => openModal(location)}>
                <View style={[styles.relativeContainer, { width, height }]}>
                    <LocationHeartSolidSvg 
                        width={width * 0.8} 
                        height={height * 0.8}  
                        style={themeStyles.friendFocusSectionIcon}
                        /> 
                </View>
                </TouchableOpacity>
            )} 
            estimatedItemSize={width * 1.2}  
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            />
        )}
            {isModalVisible && (
                <ItemViewLocation location={selectNewLocation} onClose={closeModal} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        minHeight: 2,
        alignContent: 'center',
        justifyContent: 'center',
    },
    relativeContainer: {
        marginHorizontal: 2,
        position: 'relative',  
    },  
});

export default ItemLocationFavesHorizontal;
