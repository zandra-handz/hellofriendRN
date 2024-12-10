import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location'; // Import from expo-location
import Geocoder from 'react-native-geocoding';
import { GOOGLE_API_KEY } from '@env';
import DirectionsLink from '../components/DirectionsLink';
import SelectAddressModal from '../components/SelectAddressModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import EditPencilOutlineSvg from '../assets/svgs/edit-pencil-outline.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import DualLocationSearcher from '../components/DualLocationSearcher';

// Initialize Geocoder with your Google Maps API key
Geocoder.init(GOOGLE_API_KEY);

const SelectorAddressBase = ({ height, titleBottomMargin, addresses, currentLocation, currentAddressOption, onAddressSelect, contextTitle }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [localAddressOptions, setLocalAddressOptions] = useState([]);
  const { themeStyles } = useGlobalStyle();

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const options = addresses.map((address) => {
        const uniqueKey = `${address.title}-${address.coordinates ? address.coordinates.join(',') : `${address.latitude},${address.longitude}`}`;
    
        return {
          key: uniqueKey, 
          id: address.id,
          address: address.address,
          title: address.title,
          label: address.title,
          latitude: address.coordinates ? address.coordinates[0] : address.latitude,
          longitude: address.coordinates ? address.coordinates[1] : address.longitude,
          
        };
      });
      setLocalAddressOptions(options);
      if (currentLocation) {
        setSelectedAddress(currentLocation);

      } else { 
      setSelectedAddress(options[0]);
      }
      onAddressSelect(options[0]);  
    }
  }, [addresses, currentLocation]);

  const handleUseCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;

      const newAddress = {
        address: address,
        latitude: latitude,
        longitude: longitude,
        title: 'Current Location',
      };

      setSelectedAddress(newAddress);
      onAddressSelect(newAddress);
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location.');
    }
  };

  const handleAddressSelect = (address) => {
    if (address) {
      setSelectedAddress(address);
      onAddressSelect(address);
      setIsEditingAddress(false);
      //handleLocationAlreadyExists(location, true); //true is for addMessage
      //const appOnly = sortedLocations.find(item => item.id === location.id);
      //setAppOnlyLocationData(appOnly || null); 

    };
  }

  return (
    <>
      <View style={[styles.container, themeStyles.genericTextBackground, {height: height}]}>
        <View style={{flexDirection: 'row',  alignContent: 'center'}}>
        <Text style={[styles.title, themeStyles.genericText, {marginBottom: titleBottomMargin}]}>{contextTitle}</Text>
          {currentAddressOption && !currentLocation && ( 
          <TouchableOpacity style={{marginHorizontal: '3%' }} onPress={handleUseCurrentLocation}>
            <Text style={[ themeStyles.genericText, {fontSize: 14, fontWeight: 'bold' }]}>
              Use current location?
            </Text>
          </TouchableOpacity>
          )}
        </View>

        <View style={[styles.displayContainer, themeStyles.genericTextBackgroundShadeTwo, {borderColor: themeStyles.genericText.color}]}>
           {selectedAddress && selectedAddress.address && (
              <Text style={[themeStyles.genericText, styles.displayText]}>{selectedAddress?.address}</Text>
            )}
            {!selectedAddress && (
              <Text style={[themeStyles.genericText, styles.displayText]}>No addresses saved</Text>
            )} 
          {addresses.length > 0 && ( 
          <EditPencilOutlineSvg
            height={24}
            width={24}
            size={24}
            color={themeStyles.genericText.color}
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}
          {addresses.length === 0 && ( 
          <FontAwesome
            name="search"
            size={24}
            color={themeStyles.genericText.color}
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}

        </View>
        

    </View>
      
      <SelectAddressModal
      content={
        <DualLocationSearcher
        onPress={handleAddressSelect}
        locationListDrilledOnce={localAddressOptions}
        />
      }
        isEditingAddress={isEditingAddress}
        setIsEditingAddress={setIsEditingAddress}
        localAddressOptions={localAddressOptions}
        selectedAddress={selectedAddress}
        onAddressSelect={(address) => {
          setSelectedAddress(address);
          onAddressSelect(address);
        }}
        setShowAddressOptions={setShowAddressOptions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'column', 
    borderRadius: 20,  
    width: '100%',  
  },
  title: {
    fontSize: 16, 
    //textTransform: 'uppercase', 
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%', 
    borderBottomWidth: 0,
    borderRadius: 20, 
    paddingHorizontal: '3%',
    paddingVertical: '3%',
    paddingRight: '10%', //space for the icon button
  },
  displayText: {
    fontSize: 16,
    lineHeight: 21, 
  },
  icon: {
    position: 'absolute', 
    right: 10,
 
  },
  addressText: {
    fontSize: 16, 
  },
  searchIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pickerContainer: {
    flex: 1,
  },
  hardcodedLabel: {
    fontSize: 16, 
  },
  picker: {
    height: 50,
  },
  searchButton: {
    marginLeft: 10,
  }, 
  closeButton: {
    marginTop: 20,
    backgroundColor: 'limegreen',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SelectorAddressBase;
