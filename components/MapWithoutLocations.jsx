import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const MapWithoutLocations = ({ locations }) => {
  const mapRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const isValidCoordinate = (latitude, longitude) => {
    return (
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude !== null &&
      longitude !== null
    );
  };

  useEffect(() => {
    if (locations.length > 0 && !initialRegion) {
      const initialLocation = locations.find((location) =>
        isValidCoordinate(location.latitude, location.longitude)
      );
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

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          scrollEnabled={true}
          zoomEnabled={true}
        />
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
  

export default MapWithoutLocations;
