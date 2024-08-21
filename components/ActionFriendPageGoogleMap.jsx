import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputSearchAddress from '../components/InputSearchAddress';
import { useLocationList } from '../context/LocationListContext';
import MapWithoutLocations from '../components/MapWithoutLocations';
import ItemLocationSingle from '../components/ItemLocationSingle';

const ActionFriendPageGoogleMap = ({ isModalVisible, toggleModal, onClose }) => {
    const { locationList, selectedLocation, setSelectedLocation } = useLocationList();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        console.log('Selected Location Changed:', selectedLocation);
    }, [selectedLocation]);

    const handleGooglePress = (data, details = null) => {
        if (details) {
            const { formatted_address } = details;
            setSelectedLocation(formatted_address);
        }
    };

    const renderAdditionalSatellites = () => (
        <FlatList
            data={locationList}
            horizontal
            keyExtractor={(item, index) => `additional-satellite-${index}`}
            renderItem={({ item }) => (
                <ItemLocationSingle locationObject={item} />
            )}
        />
    );

    return (
        <Modal visible={isModalVisible} onRequestClose={toggleModal}>
            <GestureHandlerRootView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                    <View style={styles.mapContainer}>
                        <InputSearchAddress onPress={handleGooglePress} />
                        <MapWithoutLocations locations={locationList} selectedLocation={selectedLocation} />
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignContent: 'center',
        padding: 4,
        paddingTop: 50,
    },
    mapContainer: {
        flex: 1,
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
        height: 90,
        backgroundColor: 'black',
    },
    categoryText: {
        fontSize: 18,
        color: 'white',
        marginLeft: 20,
        textTransform: 'uppercase',
    },
});

export default ActionFriendPageGoogleMap;
