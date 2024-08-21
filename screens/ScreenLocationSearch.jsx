
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InputSearchAddress from '../components/InputSearchAddress';
import MapWithoutLocations from '../components/MapWithoutLocations';
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
                <ItemLocationSingle locationObject={item} spacer={50} color="white" />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            ListFooterComponent={<View style={{ width: 300 }} />} // Add blank space at the end of the list
    
        />
    ), [locationList, onViewableItemsChanged]);

    return (
        <GestureHandlerRootView style={styles.container}> 
                <View style={styles.mapContainer}>
                    <View style={{zIndex: 2, position: 'absolute', width: '100%'}}>
                    <InputSearchAddress />
                    </View> 
                    <MapWithLocations locations={locationList} />
                </View>
                {locationList && (
                    <View style={styles.additionalSatelliteSection}>
                        <Text style={styles.categoryText}>{category}</Text>
                        {renderAdditionalSatellites()}
                    </View>
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
