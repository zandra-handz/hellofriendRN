import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocationList } from '../context/LocationListContext';

const MapWithLocations = ({ locations }) => {
  const mapRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [isInvalidLocation, setIsInvalidLocation] = useState(false);
  const { selectedLocation, setSelectedLocation } = useLocationList();
    
  const isValidCoordinate = (latitude, longitude) => {
    return !isNaN(latitude) && !isNaN(longitude) && latitude !== null && longitude !== null;
  };

  useEffect(() => {
    if (locations.length > 0 && !initialRegion) {
      const initialLocation = locations.find(location => isValidCoordinate(location.latitude, location.longitude));
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
  }, [locations]);

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

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onRegionChangeComplete={(region) => setInitialRegion(region)}
        >
          {locations.map(location => {
            if (isValidCoordinate(location.latitude, location.longitude)) {
              return (
                <Marker
                  key={location.id.toString()}
                  coordinate={{
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                  }}
                  title={location.title}
                  description={location.address}
                />
              );
            }
            return null;
          })}
        </MapView>
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1, // Ensure the map takes up the entire space of the container
    width: '100%', // Full width
    height: '100%', // Full height
  },
});

export default MapWithLocations;
