import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { useMessage} from '../context/MessageContext';

const useCurrentLocation = (autoFetch = true) => {
    const { showMessage } = useMessage();
    const [currentLocationDetails, setCurrentLocationDetails] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [ currentLocationIsCalculating, setCurrentLocationIsCalculating] = useState(false);
    const currentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Permission to access location was denied. Please enable it in settings.'
                );
                return;
            }
            setCurrentLocationIsCalculating(true);
            showMessage(true, null, 'Getting your location...');
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = currentLocation.coords;

            const response = await Geocoder.from(latitude, longitude);
            const address = response.results[0]?.formatted_address || 'Unknown Address';

            const newAddress = {
                address,
                latitude,
                longitude,
                title: 'My location',
            };

            setCurrentLocationDetails(newAddress);
            setCurrentRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setCurrentLocationIsCalculating(false);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Unable to get current location.');
            setCurrentLocationIsCalculating(false);
        } finally {
            setCurrentLocationIsCalculating(false);

        }
    };

    useEffect(() => {
        if (autoFetch) {
            currentLocation();
        }
    }, [autoFetch]);

    return { currentLocationDetails, currentRegion, setCurrentRegion, currentLocation, currentLocationIsCalculating };
};

export default useCurrentLocation;
