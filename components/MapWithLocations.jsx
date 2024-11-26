import * as Location from 'expo-location';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Platform, Alert, Dimensions, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import LocationOverMapButton from '../components/LocationOverMapButton';
import Geocoder from 'react-native-geocoding';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext'; 
import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';

const MapWithLocations = () => {
  const mapRef = useRef(null);
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [initialRegion, setInitialRegion] = useState(null);
  const [isInvalidLocation, setIsInvalidLocation] = useState(false);
  const { locationList } = useLocationFunctions();
  const [selectedLocation, setSelectedLocation  ] = useState(locationList[0] || null);
  const { selectedFriend, friendDashboardData } = useSelectedFriend(); 
  
  useEffect(() => {
    const handleUseCurrentLocation = async () => {
      try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Permission to access location was denied. Please enable it in settings.'
          );
          return;
        }
  
        // Get user's current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
  
        const { latitude, longitude } = location.coords;
  
        // Reverse geocoding to get the address
        const response = await Geocoder.from(latitude, longitude); // Ensure Geocoder is properly configured
        const address = response.results[0]?.formatted_address || 'Unknown Address';
  
        const newAddress = {
          address,
          latitude,
          longitude,
          title: 'Current Location',
        };
  
        setSelectedLocation(newAddress);
  
        // Set the initial region to the user's current location
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to get current location.');
      }
    };
  
    handleUseCurrentLocation();
  }, []);
  


  const faveLocations = useMemo(() => {
    console.log('Filtering favorite locations');
    if (locationList) {
    return locationList.filter(location =>
      friendDashboardData[0].friend_faves.locations.includes(location.id)
    );
    }
  }, [locationList, friendDashboardData]);
 

  const isValidCoordinate = (latitude, longitude) => {
    return !isNaN(latitude) && !isNaN(longitude) && latitude !== null && longitude !== null;
  };

  useEffect(() => {
    if (locationList && locationList.length > 0 && !initialRegion) {
      const initialLocation = locationList.find(location => isValidCoordinate(location.latitude, location.longitude));
      if (initialLocation) {
        const region = {
          latitude: parseFloat(initialLocation.latitude),
          longitude: parseFloat(initialLocation.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(region);
      }
    }
  }, [locationList]);

  const scrollElementHeight = 100;

  

  const soonButtonWidth = 140;
 // const friendItemButtonWidth = 160;

  const soonListRightSpacer = Dimensions.get("screen").width - 136;

  const friendItemButtonWidth = Dimensions.get("screen").width / 2.6;

  const buttonRightSpacer = 6;
 
  const calendarButtonHeight = (scrollElementHeight / .6);

  const handlePress = (location) => {
    if (location) {
      setSelectedLocation(location);

    };
  }

  const transformCoordinateDataType = (latitude, longitude ) => {

  };

  const renderBottomScrollList = () => {
    return (
      <Animated.FlatList
      data={faveLocations}
      horizontal={true}
      keyExtractor={(item, index) => `fl-${index}`}
      getItemLayout={(data, index) => (
        {length: buttonWidth, offset: buttonWidth * index, index }
      )}

      renderItem={({ item }) => (
            <View style={{marginRight: buttonRightSpacer, height: '30%', flex: 1}}>
            <LocationOverMapButton 
              height={'30%'} 
              friendName={item.title || item.address}  
              width={soonButtonWidth} 
              onPress={() => (handlePress(item))} /> 
              
          </View>

      )}
      showsHorizontalScrollIndicator={false}
      scrollIndicatorInsets={{ right: 1 }}
      initialScrollIndex={0}
      ListFooterComponent={() => <View style={{ width: soonListRightSpacer }} />}
      
      snapToInterval={soonButtonWidth + buttonRightSpacer}  // Set the snapping interval to the height of each item
      snapToAlignment="start"  // Align items to the top of the list when snapped
      decelerationRate="fast" 
    />

    )
  }

  useEffect(() => {
    if (selectedLocation) {
      console.log('selectedLocation changed:', selectedLocation); // Log when selectedLocation changes
      if (mapRef.current && isValidCoordinate(selectedLocation.latitude, selectedLocation.longitude)) {
        const newRegion = {
          latitude: parseFloat(selectedLocation.latitude),
          longitude: parseFloat(selectedLocation.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        mapRef.current.animateToRegion(newRegion, 200);
        setIsInvalidLocation(false);
      } else {
        setIsInvalidLocation(true);
      }
    }
  }, [selectedLocation]);

  


  const renderLocationsMap = (locations) => (
    <>
      {initialRegion ? (
        <MapView
          {...(Platform.OS === 'android' && { provider: PROVIDER_GOOGLE })}
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
        >
 
          {locations.map(location =>
              <Marker
                key={location.id.toString()}
                coordinate={{
                  latitude: parseFloat(location.latitude),
                  longitude: parseFloat(location.longitude),
                }}
                title={location.title}
                description={location.address}
              /> 
          )}
        </MapView>
      ) : null}
    </>
  );

  return (
    <LinearGradient
    colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}  
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={[styles.container]} 
  > 
    {locationList && faveLocations && ( 
      <>
        {renderLocationsMap(faveLocations)}
       
        <View style={styles.scrollContainer}>
          {renderBottomScrollList()}
        </View>
        <View style={[styles.detailsContainer, themeStyles.genericTextBackground]}>

        </View>
</>
      )}

      <ButtonGoToFindLocation />

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  map: {  // Ensure the map takes up the entire space of the container
    width: '100%', // Full width 
    height: '50%',
    top: 50,
    paddingBottom: 100,
    zIndex: 3,
  },
  detailsContainer: {
    flexGrow: 1, 
    width: '100%',

  },
  scrollContainer: {
    width: '100%',
    height: 'auto', 
    top: 56, 
    flex: 1,
    zIndex: 0,


  },
});

export default MapWithLocations;
