import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Dimensions, Modal, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputSearchAddress from '../components/InputSearchAddress';
import { useLocationList } from '../context/LocationListContext';

import MapWithLocations from '../components/MapWithLocations';
import ItemLocationSingle from '../components/ItemLocationSingle';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ActionFriendPageGoogleMap = ({ isModalVisible, toggleModal, onClose }) => {
    const { locationList, selectedLocation, setSelectedLocation, } = useLocationList();
    
    const [category, setCategory] = useState(null);

    useEffect(() => {
        console.log('Selected Location Changed:', selectedLocation);
    }, [selectedLocation]);

    const handleGooglePress = (data, details = null) => {
        console.log("Address selected"); // Log whenever an address is selected
        console.log("Data:", data);
        console.log("Details:", details);
        if (details) {
            const { formatted_address } = details;
            console.log('Selected Address:', formatted_address); // Log selected address
            setSelectedLocation(formatted_address);
        }
    };

    const handleGoogleSearchClose = () => {


    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const topItem = viewableItems[0].item;

            setCategory(topItem.name); // Correct usage
            setSelectedLocation(topItem);
            console.log('Top item:', topItem);
            console.log('Category:', topItem.title); // Correct usage
        }
    }).current;

   

    const renderAdditionalSatellites = useCallback(() => {
        return (
            <FlatList
                data={locationList}
                horizontal
                keyExtractor={(item, index) => `additional-satellite-${index}`}
                renderItem={({ item }) => (
                    <ItemLocationSingle locationObject={item} />
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
            />
        );
    }, [locationList, onViewableItemsChanged]);

    return (
        <Modal visible={isModalVisible} onRequestClose={toggleModal}>
            <GestureHandlerRootView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity> 
                    <View style={styles.mapContainer}>
                    <InputSearchAddress />
                        <MapWithLocations
                            locations={locationList} 
                        />
                    </View>
                    {locationList && (
                        <View style={styles.additionalSatelliteSection}>
                            <Text style={styles.categoryText}>{category}</Text>
                            {renderAdditionalSatellites()}
                        </View>
                    )}
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        marginTop: 0, // Adjust this value to ensure the map is not covered by the search bar
        zIndex: -1, // Ensure the map is interactive
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
    textInputContainer: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: 10,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingRight: 0,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    searchIcon: {
        position: 'absolute',
        right: 14,
        top: 10,
    },
    listView: {
        backgroundColor: 'white',
        marginTop: 0,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        maxHeight: 200,
        zIndex: 1,
    },
    floatingContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        borderRadius: 20,
        height: 30,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginLeft: 6,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: .2,
        borderColor: 'gray',
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 3,
    },
    predefinedPlacesDescription: {
        color: '#1faadb',
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

export default ActionFriendPageGoogleMap;
