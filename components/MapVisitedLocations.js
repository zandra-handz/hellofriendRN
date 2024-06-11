import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, OverLay } from 'react-native-maps';

const MapVisitedLocations = ({ locations, selectedLocation }) => {
  const mapRef = useRef(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isInvalidLocation, setIsInvalidLocation] = useState(false);

  const isValidCoordinate = (latitude, longitude) => {
    return !isNaN(latitude) && !isNaN(longitude) && latitude !== null && longitude !== null;
  };

  useEffect(() => {
    if (locations.length > 0 && !mapRegion) {
      const initialLocation = locations.find(location => isValidCoordinate(location.latitude, location.longitude));
      if (initialLocation) {
        const initialRegion = {
          latitude: parseFloat(initialLocation.latitude),
          longitude: parseFloat(initialLocation.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setMapRegion(initialRegion);
      }
    }
  }, [locations]);

  useEffect(() => {
    if (selectedLocation) {
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
      {mapRegion && (
        <MapView ref={mapRef} style={styles.map} region={mapRegion}>
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
      {isInvalidLocation && <View style={styles.overlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
});

export default MapVisitedLocations;
