
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { useMessage } from '../context/MessageContext';


// I added a is user authenticated check to this and it created a second instance of expo or something? 
// no idea why; perhaps it is getting permission a different way when it asks for it on sign in page (before user has signed in)
import * as Linking from 'expo-linking'; // For opening device settings

const useCurrentLocation = (autoFetch = true) => {
    const { showMessage } = useMessage();
    const [currentLocationDetails, setCurrentLocationDetails] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [currentLocationIsCalculating, setCurrentLocationIsCalculating] = useState(false);

    const generateTemporaryId = () => `temp_${Date.now()}`;

    const handleLocationSettings = () => {
        Alert.alert(
            'Location Permission Required',
            'Please enable location access in your device settings to use this feature.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
    };

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            
            if (status === 'denied') {
                handleLocationSettings();
                return;
            }

            if (status === 'undetermined') {
                const requestStatus = await Location.requestForegroundPermissionsAsync();
                if (requestStatus.status !== 'granted') {
                    handleLocationSettings();
                    return;
                }
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
                id: generateTemporaryId(),
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
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Unable to get current location.');
        } finally {
            setCurrentLocationIsCalculating(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            getCurrentLocation();
        }
    }, [autoFetch]);

    return { 
        currentLocationDetails, 
        currentRegion, 
        setCurrentRegion, 
        getCurrentLocation, 
        currentLocationIsCalculating 
    };
};

export default useCurrentLocation;
