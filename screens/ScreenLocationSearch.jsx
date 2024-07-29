
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputSearchAddress from '../components/InputSearchAddress';
import MapWithLocations from '../components/MapWithLocations';
import ItemLocationSingle from '../components/ItemLocationSingle';
import { useLocationList } from '../context/LocationListContext';

const ScreenLocationSearch = ({ route, navigation }) => {
    const { locationList, selectedLocation, setSelectedLocation } = useLocationList();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        console.log('Selected Location Changed:', selectedLocation);
    }, [selectedLocation]);

    const handleGooglePress = (data, details = null) => {
        console.log("Address selected");
        console.log("Data:", data);
        console.log("Details:", details);
        if (details) {
            const { formatted_address } = details;
            console.log('Selected Address:', formatted_address);
            setSelectedLocation(formatted_address);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const topItem = viewableItems[0].item;
            setCategory(topItem.name);
            setSelectedLocation(topItem);
            console.log('Top item:', topItem);
            console.log('Category:', topItem.title);
        }
    }).current;

    const renderAdditionalSatellites = useCallback(() => (
        <FlatList
            data={locationList}
            horizontal
            keyExtractor={(item, index) => `additional-satellite-${index}`}
            renderItem={({ item }) => (
                <ItemLocationSingle locationObject={item} />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
    ), [locationList, onViewableItemsChanged]);

    return (
        <GestureHandlerRootView style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity> 
                <View style={styles.mapContainer}>
                    <InputSearchAddress />
                    <MapWithLocations locations={locationList} />
                </View>
                {locationList && (
                    <View style={styles.additionalSatelliteSection}>
                        <Text style={styles.categoryText}>{category}</Text>
                        {renderAdditionalSatellites()}
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderRadius: 0,
        padding: 4,
        paddingTop: 50,
    },
    mapContainer: {
        flex: 1,
        marginTop: 0,
        zIndex: -1,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    additionalSatelliteSection: {
        flexDirection: 'column',
        marginVertical: 0,
        height: 90,
        borderRadius: 30,
        backgroundColor: 'black',
    },
    categoryText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        marginLeft: 20,
        marginBottom: 0,
        textTransform: 'uppercase',
    },
});

export default ScreenLocationSearch;
