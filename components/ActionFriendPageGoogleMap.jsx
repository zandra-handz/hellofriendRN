import React from 'react';
import { View, Dimensions, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from  '../context/SelectedFriendContext';
import MapVisitedLocations from '../components/MapVisitedLocations';

const ActionFriendPageGoogleMap = ({ isModalVisible, toggleModal, onClose }) => {
    const { locationList, faveLocationList } = useLocationList();
   
    const windowHeight = Dimensions.get('window').height;

    return (
        <Modal visible={isModalVisible} onRequestClose={toggleModal} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity> 
                    <GooglePlacesAutocomplete
                        placeholder="Search"
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data, details);
                            // handle the location selection here
                        }}
                        query={{
                            key: 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk',
                            language: 'en',
                        }}
                        styles={{
                            container: {
                                flex: 0,
                                position: 'absolute',
                                width: '100%',
                                zIndex: 1,
                                top: 0,
                                backgroundColor: 'white',
                            },
                            listView: {
                                backgroundColor: 'white',
                            },
                        }}
                    />
                    <View style={styles.mapContainer}>
                        <MapVisitedLocations locations={locationList} selectedLocation={locationList[0]} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderRadius: 0,
        padding: 4,
        paddingTop:50,
        height: '100%',
        maxHeight: '100%',
    },
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 0.8,
        marginTop: 50, // Adjust this value to ensure the map is not covered by the search bar
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
});

export default ActionFriendPageGoogleMap;
