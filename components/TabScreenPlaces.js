import React, { useState, useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CardLocationTopper from './CardLocationTopper';
import CardLocation from './CardLocation';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import MapVisitedLocations from './MapVisitedLocations';

const TabScreenPlaces = () => {
  const { selectedFriend } = useSelectedFriend();
  const { locationList } = useLocationList();
  const [sortedLocationList, setSortedLocationList] = useState([]);
  const [filteredLocationList, setFilteredLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const flatListRef = useRef(null);
  const [isStarSelected, setIsStarSelected] = useState(false);
  const [itemHeight, setItemHeight] = useState(0); // State to store the height of each item

  useEffect(() => {
    const sortedList = [...locationList].sort((a, b) => {
      if (a.validatedAddress === b.validatedAddress) return 0;
      return a.validatedAddress ? -1 : 1;
    });
    setSortedLocationList(sortedList);
    setSelectedLocation(sortedList[0]);
    filterLocations(isStarSelected, sortedList);
  }, [locationList, isStarSelected]);

  useEffect(() => {
    setIsStarSelected(true);
    filterLocations(true, sortedLocationList);
  }, [selectedFriend]);

  useEffect(() => {
    // Measure the height of a sample item
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0 });
    }
  }, [flatListRef]);

  const filterLocations = (isStarSelected, locations) => {
    let filteredList = [...locations];
    if (isStarSelected && selectedFriend) {
      filteredList = locations.filter(location => location.friends.some(friend => friend.id === selectedFriend.id));
    }
    setFilteredLocationList(filteredList);
  };

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
      const visibleItems = viewableItems.map(item => ({
        ...item,
        top: item.itemIndex * itemHeight,
        bottom: (item.itemIndex + 1) * itemHeight,
      }));

      const windowHeight = Dimensions.get('window').height;

      const closestItem = visibleItems.reduce((closest, currentItem) => {
        const currentMiddle = (currentItem.top + currentItem.bottom) / 2;
        const closestMiddle = (closest.top + closest.bottom) / 2;
        const currentDistance = Math.abs(windowHeight / 2 - currentMiddle);
        const closestDistance = Math.abs(windowHeight / 2 - closestMiddle);
        return currentDistance < closestDistance ? currentItem : closest;
      });

      setSelectedLocation(closestItem.item);
      console.log('Selected Location:', closestItem.item);
    }
  };

  const onDoubleTap = (item) => {
    setSelectedLocation(item);
  };

  const handleToggleStar = (isStarSelected) => {
    setIsStarSelected(isStarSelected);
    filterLocations(isStarSelected, sortedLocationList);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapVisitedLocations locations={locationList} selectedLocation={selectedLocation} />
        </View>
        <View style={styles.cardContainer}>
          <CardLocationTopper backgroundColor="white" iconColor="white" selectedAddress={selectedLocation} onToggleStar={handleToggleStar} />
          <FlatList
            ref={flatListRef}
            data={[...filteredLocationList, { isSpacer: true }]}
            renderItem={({ item }) => (
              item.isSpacer ? (
                <View style={styles.spacer} />
              ) : (
                <View style={item.id === selectedLocation?.id ? styles.selectedCardContainer : styles.cardWrapper} onLayout={(event) => setItemHeight(event.nativeEvent.layout.height)}>
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
              )
            )}
            keyExtractor={item => item.id ? item.id.toString() : 'spacer'}
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
    flex: 0.8,
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
    borderWidth: 0.5,
    marginBottom: 0,
    marginTop: -1,
    zIndex: 1,
  },
  spacer: {
    height: 300,
    backgroundColor: 'white',
  },
});

export default TabScreenPlaces;