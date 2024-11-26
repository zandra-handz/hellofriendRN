

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SearchBarGoogleAddress from '../components/SearchBarGoogleAddress';

import MapWithLocations from '../components/MapWithLocations';


import useLocationFunctions from '../hooks/useLocationFunctions';

const ScreenLocationSearch = ({ route, navigation }) => {
    const { locationList, selectedLocation, setSelectedLocation } = useLocationFunctions();

    useEffect(() => {
        console.log('Selected Location Changed:', selectedLocation);
    }, [selectedLocation]);


 

    return (
        <GestureHandlerRootView style={styles.container}> 
                <View style={{zIndex: 2, position: 'absolute', height: 300, width: '100%', backgroundColor: 'transparent', top: 0}}>
                <SearchBarGoogleAddress />
                </View>

                {locationList && (
                    <>
                    <View style={styles.mapContainer}>

                        <MapWithLocations locations={locationList} />
                    </View> 
                    </>
                )} 
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    mapContainer: {
      flex: 1, // This ensures it takes up available space
      justifyContent: 'flex-start',
    },
    additionalSatelliteSection: {
      flexDirection: 'column',
      
      height: 90, // Adjust as needed
      borderRadius: 0,
      paddingHorizontal: 10,
      backgroundColor: 'transparent',
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
