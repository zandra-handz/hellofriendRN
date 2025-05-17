

import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
 
import LocationsMapView from '@/app/components/locations/LocationsMapView';
 
import useLocationHelloFunctions from '@/src/hooks/useLocationHelloFunctions';
import useLocationDetailFunctions from '@/src/hooks/useLocationDetailFunctions';
// import { 
//   useGeolocationWatcher,
// } from "@/src/hooks/useCurrentLocationAndWatcher"; 

import { useHelloes } from '@/src/context/HelloesContext';
import { useLocations } from '@/src/context/LocationsContext';
 
const ScreenLocationSearch = () => {
  
  // useGeolocationWatcher(); 
 

    const { locationList } = useLocations();
    const { getCurrentDay } = useLocationDetailFunctions();
    const { getCachedInPersonHelloes } = useHelloes();
    const { createLocationListWithHelloes, bermudaCoords } = useLocationHelloFunctions();

    const inPersonHelloes = getCachedInPersonHelloes();
    
    const [ sortedLocations, setSortedLocations ] = useState([]);
    
    useLayoutEffect(() => { 
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
