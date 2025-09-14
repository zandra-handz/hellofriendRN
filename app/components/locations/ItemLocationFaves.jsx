import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import LocationRoundOutlineSvg from '@/app/assets/svgs/location-round-outline.svg';

import { useLocationList } from '@/src/context/LocationListContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import ItemViewLocation from '../components/ItemViewLocation';
 

const ItemLocationFaves = ({ horizontal = true, singleLineScroll = true, containerWidth=260, width = 160, height = 160  }) => {
    const { friendDashboardData } = useSelectedFriend();
    const { locationList, faveLocationList, populateFaveLocationsList } = useLocationList();
  

    useEffect(() => {
        if (friendDashboardData && friendDashboardData.length > 0) {
            const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations || [];
            populateFaveLocationsList(favoriteLocationIds);
        }
    }, [locationList, friendDashboardData]);

    // useEffect(() => {
    //     console.log('Favorite Locations:', faveLocationList); // Logging faveLocationList
    // }, [faveLocationList]);

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

    const calculateFontSize = (width) => {
        return width * 0.06;
    };

    const calculateBubbleContainerDimensions = (width, height) => {
        return {
            width: width * 0.8,
            height: height * 0.33,
        };
    };

    const calculateLeftPadding = (bubbleWidth) => {
        return bubbleWidth * 0.35;
    };

    const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);

    return (
        <View style={[styles.container, {width: containerWidth}]}>
            <FlashList
            data={faveLocationList}
            horizontal={horizontal && singleLineScroll}
            keyExtractor={(location) => location.id.toString()}
            renderItem={({ item: location }) => (
                <TouchableOpacity onPress={() => openModal(location)}>
                <View style={[styles.relativeContainer, { width, height }]}>
                    <LocationRoundOutlineSvg 
                    width={width -5} 
                    height={height -5}  
                    color={'white'}  
                    />
                    <View 
                    style={[styles.bubbleContainer, bubbleContainerDimensions, { 
                        paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) 
                    }]}
                    >
                    <Text 
                        style={[styles.bubbleText, { 
                        fontSize: calculateFontSize(width), 
                        top: bubbleContainerDimensions.height * 0.7 
                        }]}
                    >
                        {location.title}
                    </Text>
                    </View>
                </View>
                </TouchableOpacity>
            )}
            numColumns={horizontal && !singleLineScroll ? 3 : 1}
            columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
            estimatedItemSize={Math.max(width, height)} // Adjusted for the size estimation
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            />



            {isModalVisible && (
                <ItemViewLocation location={selectedLocation} onClose={closeModal} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
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

export default ItemLocationFaves;
