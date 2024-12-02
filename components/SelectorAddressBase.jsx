import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location'; // Import from expo-location
import Geocoder from 'react-native-geocoding';
import { GOOGLE_API_KEY } from '@env';
import DirectionsLink from '../components/DirectionsLink';
import SelectAddressModalVersion from '../components/SelectAddressModalVersion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useGlobalStyle } from '../context/GlobalStyleContext';

// Initialize Geocoder with your Google Maps API key
Geocoder.init(GOOGLE_API_KEY);

const SelectorAddressBase = ({ addresses, currentAddressOption, onAddressSelect, contextTitle }) => {
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
          label: address.title,
          value: {
            address: address.address,
            label: address.title,
            lat: address.coordinates ? address.coordinates[0] : address.latitude,
            lng: address.coordinates ? address.coordinates[1] : address.longitude,
          },
        };
      });
      setLocalAddressOptions(options);
      setSelectedAddress(options[0].value);
      onAddressSelect(options[0].value);  
    }
  }, [addresses]);

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

  return (
    <>
      <View style={styles.container}>
        <View style={{flexDirection: 'row',  alignContent: 'center'}}>
        <Text style={styles.cardTitle}>{contextTitle}</Text>
          {currentAddressOption && ( 
          <TouchableOpacity style={{marginHorizontal: 10, marginTop:3 }} onPress={handleUseCurrentLocation}>
            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 13 }}>
              Use current location?
            </Text>
          </TouchableOpacity>
          )}
        </View>

        <View style={styles.hintContainer}>
          <View style={{borderRadius: 20, width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc'}}>
            {selectedAddress && (
              <DirectionsLink address={selectedAddress.address} size={15} />
            )}
            {!selectedAddress && (
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15}}>No addresses saved</Text>
            )}
            <Text style={styles.hintText}>
              {selectedAddress ? '' : 'No address selected'}
            </Text>
          </View>
          {addresses.length > 0 && ( 
          <FontAwesome
            name="pencil"
            size={24}
            color="limegreen"
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}
          {addresses.length === 0 && ( 
          <FontAwesome
            name="search"
            size={24}
            color="limegreen"
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}
        </View>

    </View>
      
      <SelectAddressModalVersion
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
    flex: 1,
    flexDirection: 'column',
    padding: 0, 
    borderRadius: 20,
    marginBottom: 8,
    height: 50,
    width: '100%',  
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10, 
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '90%',
    justifyContent: 'space-between',
  },
  hintText: {
    fontSize: 16,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 20, 
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
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  searchButton: {
    marginLeft: 10,
  },
  textInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    paddingLeft: 10, 
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
