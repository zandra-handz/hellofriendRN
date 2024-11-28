import * as Location from 'expo-location';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Platform, Alert, TouchableOpacity, Text, Dimensions, Animated, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import LocationOverMapButton from '../components/LocationOverMapButton';
import Geocoder from 'react-native-geocoding';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext'; 
import ButtonGoToFindLocation from '../components/ButtonGoToFindLocation';
import LocationHeartSolidSvg from '../assets/svgs/location-heart-solid.svg';
import useHelloesData from '../hooks/useHelloesData';
import ButtonGoToLocationFunctions from '../components/ButtonGoToLocationFunctions';

const MapWithLocations = () => {
  const mapRef = useRef(null);
  const { helloesList, inPersonHelloes } = useHelloesData();
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [initialRegion, setInitialRegion] = useState(null);
  const [isInvalidLocation, setIsInvalidLocation] = useState(false);
  const { locationList, loadingAdditionalDetails, useFetchAdditionalDetails } = useLocationFunctions();
  const [selectedLocation, setSelectedLocation  ] = useState(locationList[0] || null);
  const { selectedFriend, friendDashboardData } = useSelectedFriend(); 
  
  useEffect(() => {
    const handleUseCurrentLocation = async () => {
      try { 
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


  const findHelloesAtLocation = (singleLocationId) => {
    if (singleLocationId) { 
      const matchingHelloes = inPersonHelloes.filter(
        hello => hello.location === singleLocationId
      ); 
      return matchingHelloes.length;
    }
  };
  


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

  

  const soonButtonWidth = 190;
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
        {length: soonButtonWidth, offset: soonButtonWidth * index, index }
      )}

      renderItem={({ item }) => (
            <View style={{marginRight: buttonRightSpacer, paddingVertical: 4, height: '90%'}}>
            <LocationOverMapButton 
              height={'100%'} 
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
          enableZoomControl={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
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
                >
 
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'flex-start', 
                padding: 5, 
              }}
            >  
            <View style={{flex: 1}}>
            
            <Text style={{fontWeight: 'bold',  zIndex: 1000, position: 'absolute', top: -12, right: -8, backgroundColor: 'yellow', padding: 4, borderRadius: 20, fontSize: 12}}>
              {findHelloesAtLocation(location.id)}
              </Text> 
                
            </View>
           
            <Image
              source={require('../assets/shapes/coffeecupnoheart.png')}
              style={{ height: 35, width: 35 }}
            />
          </View> 
                
          </Marker>
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
        {selectedLocation && (
          <>
          <View style={{flexDirection: 'row'}}>
          <Text style={[themeStyles.genericText, {fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase', lineHeight: 22}]}>{selectedLocation.title}</Text>
          </View> 
                    <View style={{flexDirection: 'row'}}>
                      <Text style={themeStyles.genericText}>{selectedLocation.address}</Text>
                    </View>  
                    {selectedLocation && selectedLocation.notes && ( 
                      <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.detailsSubtitle, themeStyles.genericText]}>Notes: </Text>
                        <Text style={themeStyles.genericText}>{selectedLocation.notes}</Text>
                      </View>       
                    )}              
                    
                    {selectedLocation && selectedLocation.parking && ( 
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.detailsSubtitle, themeStyles.genericText]}>Parking: </Text>
                      <Text style={themeStyles.genericText}>{selectedLocation.parking}</Text>
                    </View> 
                  )} 
        </>
        )}
        </View>
</>
      )}

    <ButtonGoToFindLocation />

    <ButtonGoToLocationFunctions />

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
    height: '64%', 
    paddingTop: 60,
    zIndex: 3,
  },
  detailsContainer: {
    flexGrow: 1, 
    width: '100%',
    padding: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    marginTop: '0%',

  },
  detailsSubtitle: {
    fontWeight: 'bold',
    fontSize: 15,

  },
  scrollContainer: {
    width: '100%',  
    height: 50,  
    zIndex: 1000,
    justifyContent: 'center', 
    alignContent: 'center',
    alignItems: 'center',


  },
});

export default MapWithLocations;
