import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ItemViewLocation from '../components/ItemViewLocation';

const windowWidth = Dimensions.get('window').width;

const ItemLocationFaves = ({ locationData, horizontal = true, singleLineScroll = true, width = 160, height = 160, limit, newestFirst = true }) => {
    const { selectedFriend, friendDashboardData } = useSelectedFriend();
    const { locationList } = useLocationList();
    const [faveLocationList, setFaveLocationList] = useState([]);

    useEffect(() => {
        if (friendDashboardData && friendDashboardData.length > 0) {
            console.log('Friend Dashboard Daaaaaaaaaaaaata:', friendDashboardData[0].friend_faves.locations); // Logging friendDashboardData
            const favoriteLocationIds = friendDashboardData[0]?.friend_faves?.locations || [];

            console.log(favoriteLocationIds);
            const favoriteLocations = locationList.filter(location => favoriteLocationIds.includes(location.id));
            setFaveLocationList(favoriteLocations);
        }
    }, [locationList, friendDashboardData]);

    useEffect(() => {
        console.log('Favorite Locations:', faveLocationList); // Logging faveLocationList
    }, [faveLocationList]);

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
        <View style={styles.container}>
            <FlatList
                data={faveLocationList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                    <TouchableOpacity onPress={() => openModal(location)}>
                        <View style={[styles.relativeContainer, { width, height }]}>
                            <LocationOutlineSvg width={width} height={height} style={styles.svgImage} />
                            <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                                <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.7 }]}>{location.title}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={horizontal && !singleLineScroll ? 3 : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
            />

            <Modal visible={isModalVisible} onRequestClose={closeModal} transparent>
                <View style={styles.modalContainer}>
                    <ItemViewLocation location={selectedLocation} onClose={closeModal} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    relativeContainer: {
        position: 'relative',
    },
    bubbleContainer: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 1,
    },
    bubbleText: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        textAlign: 'left',
    },
    imageContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    imageRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    image: {
        margin: 5,
        borderRadius: 10,
        color: 'white',
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default ItemLocationFaves;
