import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ItemViewLocation from '../components/ItemViewLocation'; // Import your modal component
import ItemViewLocationSuggested from '../components/ItemViewLocationSuggested'; // Import your modal component


import { useLocationList } from '../context/LocationListContext';

const ButtonMakeTempLocation = ({ location, size = 11, iconSize = 16, family = 'Poppins-Bold', color = "black", style }) => {
    const { locationList, setLocationList, selectedLocation, setSelectedLocation } = useLocationList();
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    const generateTemporaryId = () => {
        return `temp_${Date.now()}`; // Use timestamp to generate a unique temporary ID
    };

    const openLocationView = () => {
        setIsLocationModalVisible(true);

    };

    const handlePress = () => {
        if (location) {
            const { name, address, latitude, longitude } = location;
            const newLocation = {
                id: generateTemporaryId(), // Generate temporary ID here
                address: address || 'Unknown Address',
                latitude: latitude || 0,
                longitude: longitude || 0,
                notes: '',
                title: name || 'Search', // Use the name from the location object
                validatedAddress: true,
                friendsCount: 0,
                friends: [],
            };

            setLocationList([newLocation, ...locationList]); // Add new location to the beginning of the list
            console.log('New Location Added:', newLocation);

            setIsLocationModalVisible(true); // Show the ItemViewLocation modal
        }
    };

    const closeModal = () => {
        setIsLocationModalVisible(false); // Hide the ItemViewLocation modal
    };

    return (
        <View>
            <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
                <FontAwesome5 name="save" size={iconSize} />
                <Text style={[styles.saveText, { fontSize: size, color: color, fontFamily: family }]}> SAVE</Text>
            </TouchableOpacity>

            {isLocationModalVisible && (
                <Modal
                    transparent={true}
                    visible={isLocationModalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalBackground}>
                        <ItemViewLocationSuggested onClose={closeModal} />
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    iconContainer: {
        margin: 4,
    },
    saveText: {
        marginLeft: 8,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
});

export default ButtonMakeTempLocation;
