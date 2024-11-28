

import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SearchBarGoogleAddress from '../components/SearchBarGoogleAddress';

import MapWithLocations from '../components/MapWithLocations';


import useLocationFunctions from '../hooks/useLocationFunctions';
import useLocationHelloFunctions from '../hooks/useLocationHelloFunctions';
import useHelloesData from '../hooks/useHelloesData';

const ScreenLocationSearch = () => {
    const { locationList } = useLocationFunctions();
    const { inPersonHelloes } = useHelloesData();
    const { createLocationListWithHelloes } = useLocationHelloFunctions();
    const [ sortedLocations, setSortedLocations ] = useState([]);
    
    useLayoutEffect(() => {
      if (locationList && inPersonHelloes) {

        const newList = createLocationListWithHelloes(locationList, inPersonHelloes);
      setSortedLocations(newList);
      }
    }, [locationList, inPersonHelloes]);

    useEffect(() => {
      if (sortedLocations) {
        console.log(sortedLocations);
      }


    }, [sortedLocations]);
 
    return (
        <GestureHandlerRootView style={styles.container}> 


                {sortedLocations && (
                    <>
                    <View style={styles.mapContainer}>
                        <MapWithLocations sortedLocations={sortedLocations} />
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
