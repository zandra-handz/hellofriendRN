

import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
 
import LocationsMapView from '../components/LocationsMapView';

import useLocationFunctions from '../hooks/useLocationFunctions';
import useLocationHelloFunctions from '../hooks/useLocationHelloFunctions';
import useLocationDetailFunctions from '../hooks/useLocationDetailFunctions';
import {
  useCurrentLocationManual,
  useGeolocationWatcher,
} from "../hooks/useCurrentLocationAndWatcher";
import useHelloesData from '../hooks/useHelloesData';

const ScreenLocationSearch = () => {
  
  useGeolocationWatcher();
  const { data, isLoadingCurrentLocation, error } = useCurrentLocationManual();


    const { locationList } = useLocationFunctions();
    const { getCurrentDay } = useLocationDetailFunctions();
    const { inPersonHelloes } = useHelloesData();
    const { createLocationListWithHelloes, bermudaCoords } = useLocationHelloFunctions();
    
    const [ sortedLocations, setSortedLocations ] = useState([]);
    
    useLayoutEffect(() => {
      console.log('use layout in screen');
      if (locationList && inPersonHelloes) {

        const newList = createLocationListWithHelloes(locationList, inPersonHelloes);
      setSortedLocations(newList);
      }
    }, [locationList, inPersonHelloes]);
 
 
    return (
        <GestureHandlerRootView style={styles.container}> 


                {sortedLocations && (
                    <>
                    <View style={styles.mapContainer}>
                        <LocationsMapView sortedLocations={sortedLocations} currentDayDrilledOnce={getCurrentDay()} bermudaCoordsDrilledOnce={bermudaCoords} />
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
