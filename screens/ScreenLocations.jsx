import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
 
import { useLocationList } from '../context/LocationListContext';

import { useNavigation } from '@react-navigation/native';

import ItemLocationMulti from '../components/ItemLocationMulti';
import ItemImageMulti from '../components/ItemImageMulti';
import ActionFriendPageGoogleMap from '../components/ActionFriendPageGoogleMap';

const ScreenLocations = ({ route, navigation}) => {


    const { locationList, faveLocationList } = useLocationList();
    const [isLocationListReady, setIsLocationListReady] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  
    const navigateToLocationSearchScreen = () => {
        navigation.navigate('LocationSearch');

    };


    const handleMapScreen = () => {
        setIsMapModalVisible(true); // Set modal visible when fullscreen button is pressed
      };
    
      const closeModal = () => {
        setIsMapModalVisible(false); // Close the modal
      };

    useEffect(() => {
        if (locationList.length > 0) {
            setIsLocationListReady(true);
        }
    }, [locationList]);

    return ( 
        <View style={styles.container}>
            <> 
            <TouchableOpacity onPress={navigateToLocationSearchScreen} style={styles.searchMapButton}>
                <Text style={styles.searchMapText}>Search</Text>
            </TouchableOpacity> 
            </>
            <ScrollView>
                {isLocationListReady ? (
                    <> 
                    <ItemLocationMulti height={100} width={100} columns={3} horizontal={true} singleLineScroll={false} newestFirst={false} svgColor='white' includeCategoryTitle={true}/>
                    
                    </>
                    
                ) : (
                    <Text>Loading...</Text>
                )}
                <ActionFriendPageGoogleMap
                isModalVisible={isMapModalVisible}
                toggleModal={closeModal} onClose={closeModal} />
                    
            </ScrollView>
        </View>

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
    searchMapButton: {
        position: 'absolute',
        top: 10,
        right: 80,
        zIndex: 1,
    },
    searchMapText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
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
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ScreenLocations;
