import React, { useState, useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CardLocationTopper from './CardLocationTopper';
import CardLocation from './CardLocation';
import { useLocationList } from '../context/LocationListContext';
import MapVisitedLocations from './MapVisitedLocations';

const TabScreenPlaces = () => {
    const { locationList } = useLocationList();
    const [sortedLocationList, setSortedLocationList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        const sortedList = [...locationList].sort((a, b) => {
            if (a.validatedAddress === b.validatedAddress) return 0;
            return a.validatedAddress ? -1 : 1;
        });
        setSortedLocationList(sortedList);
        setSelectedLocation(sortedList[0]);
    }, [locationList]);

    const generateTemporaryId = (() => {
        let count = 1;
        return () => {
            const tempId = `temp_${count}`;
            count++;
            return tempId;
        };
    })();

    const handleViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const topItem = viewableItems[0];
            const bottomItem = viewableItems[viewableItems.length - 1];
            const lastIndex = sortedLocationList.length - 1;
            if (bottomItem.index === lastIndex && bottomItem.isViewable) {
                setSelectedLocation(bottomItem.item);
                console.log("Selected Location:", bottomItem.item);
            } else if (topItem.isViewable) {
                setSelectedLocation(topItem.item);
                console.log("Selected Location:", topItem.item);
            }
        }
    };

    const onDoubleTap = (item) => {
        setSelectedLocation(item);
    };

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <MapVisitedLocations locations={locationList} selectedLocation={selectedLocation} />
                </View>
                <View style={styles.cardContainer}>
                    <CardLocationTopper backgroundColor="black" iconColor="white" />
                    <FlatList
                        ref={flatListRef}
                        data={locationList}
                        renderItem={({ item }) => (
                            <View style={item.id === selectedLocation?.id ? styles.selectedCardContainer : styles.cardWrapper}>
                                <CardLocation
                                    title={item.title}
                                    address={item.address}
                                    notes={item.notes}
                                    id={item.id || generateTemporaryId()}
                                    latitude={item.latitude}
                                    longitude={item.longitude}
                                    friendsCount={item.friendsCount}
                                    friends={item.friends}
                                    validatedAddress={item.validatedAddress}
                                    isSelected={selectedLocation && selectedLocation.id === item.id}
                                    setSelectedLocation={onDoubleTap}
                                />
                            </View>
                        )}
                        estimatedItemSize={148}
                        keyExtractor={item => item.id.toString()}
                        onViewableItemsChanged={handleViewableItemsChanged}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 50,
                        }}
                    />
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#ccc',
    },
    cardWrapper: {
        flex: 1,
    },
    selectedCardContainer: {
        position: 'relative',
        borderColor: 'hotpink',
        borderWidth: .5,
        marginBottom: 0,  
        marginTop: -1,
        zIndex: 1,  
    },
});

export default TabScreenPlaces;
