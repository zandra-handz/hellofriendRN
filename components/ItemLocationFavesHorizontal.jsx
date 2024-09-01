import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import LocationRoundOutlineSvg from '../assets/svgs/location-round-outline.svg';

import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ItemViewLocation from '../components/ItemViewLocation';
 

const ItemLocationFavesHorizontal = ({ containerWidth=260, width = 160, height = 160  }) => {
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


    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = (location) => {
        setSelectedLocation(location);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedLocation(null);
        setIsModalVisible(false);
    };
 

    const calculateBubbleContainerDimensions = (width, height) => {
        return {
            width: width * 0.8,
            height: height * 0.33,
        };
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
                    <LocationRoundOutlineSvg 
                        width={width * 0.8} 
                        height={height * 0.8}  
                        color={'white'}  
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
                <ItemViewLocation location={selectedLocation} onClose={closeModal} />
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
    bubbleContainer: {
        
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 1,
    },
    bubbleText: {
        color: 'transparent',
        fontFamily: 'Poppins-Bold',
        textAlign: 'left',
    }, 
    imageRow: {
        flex: 1,
        justifyContent: 'space-between',
    },  
});

export default ItemLocationFavesHorizontal;
