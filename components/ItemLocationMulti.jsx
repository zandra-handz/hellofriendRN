import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';

import ItemViewLocation from '../components/ItemViewLocation'; 
import LocationOutlineSvg from '../assets/svgs/location-outline.svg'; // Import the SVG
import { useLocationList } from '../context/LocationListContext';
import { FlashList } from "@shopify/flash-list"; 

const windowWidth = Dimensions.get('window').width;


const ItemLocationMulti = ({ locationData, horizontal = true, singleLineScroll = true, width = 160, height = 160, columns = 5, limit, newestFirst = true }) => {

    const { locationList } = useLocationList();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [locationTitle, setLocationTitle] = useState(''); 

    const sortedLocations = locationList.sort((a, b) => {
        return newestFirst ? new Date(b.created) - new Date(a.created) : new Date(a.created) - new Date(b.created);
    });
    const [locations, setLocations] = useState(sortedLocations.slice(0, limit)); 
    
    

    useEffect(() => {
        console.log('TOOOOTTTAAAAAALLLLLLLLLLLLLLLLLLLLLLL number of locations:', locations.length);
    }, [locations.length]);  

    const openModal = (location) => {
        console.log('Opening modal for location:', location);
        setSelectedLocation(location);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setSelectedLocation(null);
        setIsModalVisible(false);
        setIsEditing(false);
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
            <FlashList
                data={locationList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(location) => location.id.toString()}
                renderItem={({ item: location }) => (
                    <TouchableOpacity onPress={() => openModal(location)}>
                        <View style={[styles.relativeContainer, { width, height }]}>  
                            <LocationOutlineSvg width={width} height={height} style={styles.svgImage} />
                            <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                                <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.7 }]}> </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={horizontal && !singleLineScroll ? columns : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
                estimatedItemSize={99}
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
        justifyContent: 'center',
        
    },
    relativeContainer: {  
        position: 'relative',
    },
    bubbleContainer: {
        position: 'absolute',  
        justifyContent: 'flex-start', // Align items to the top
        alignItems: 'flex-start', // Align items to the left
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

export default ItemLocationMulti;
