import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SearchForMidpointLocations } from '../api';

const InputSearchMidpointLocations = ({ onClose }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
  const [search, setSearch] = useState('coffee');
  const [radius, setRadius] = useState('500');
  const [length, setLength] = useState('8'); // Added length state
  
  const addressOptions = authUserState.user.addresses.map((address) => ({
    label: address.title,
    value: {
      address: address.address,
      label: address.title,
      lat: address.coordinates[0], 
      lng: address.coordinates[1]
    },
  }));

  const handleSearch = async () => {
    try {
      const locationData = {
        address_a_address: selectedAddress.address,
        address_a_lat: parseFloat(selectedAddress.lat),
        address_a_long: parseFloat(selectedAddress.lng),
        address_b_address: selectedFriendAddress.label,
        address_b_lat: parseFloat(selectedFriendAddress.lat), 
        address_b_long: parseFloat(selectedFriendAddress.lng),
        search: search,
        radius: parseFloat(radius),
        length: parseFloat(length),
        perform_search: true,
      };

      await SearchForMidpointLocations(locationData);
      console.log("Midpoint locations search requested successfully");
    } catch (error) {
      console.error("Error searching for midpoint locations:", error);
    }
  };

  useEffect(() => {
    if (addressOptions.length > 0) {
      const homeAddresses = addressOptions.filter(option => option.label.toLowerCase().includes('home'));
      setSelectedAddress(homeAddresses.length > 0 ? homeAddresses[0].value : addressOptions[0].value);
    }
  }, [authUserState.user.addresses]);

  const handleFriendAddressSelect = (friendAddress) => {
    setSelectedFriendAddress(friendAddress); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>My Starting Point:</Text>
          <Picker
            selectedValue={selectedAddress}
            onValueChange={(value) => setSelectedAddress(value)}
            style={styles.picker}
          >
            {addressOptions.map((address, index) => (
              <Picker.Item label={address.label} value={address.value} key={index} />
            ))}
          </Picker>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Selected Friend's Starting Point:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            keepResultsAfterBlur={true}
            onPress={(data, details = null) => {
              const friendAddress = {
                label: data.description,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng
              };
              setSelectedFriendAddress(friendAddress); 
              handleFriendAddressSelect(friendAddress); 
            }}
            fetchDetails={true}
            query={{
              key: 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk',
              language: 'en',
            }}
            debounce={300}
            styles={{
              textInputContainer: styles.textInputContainer,
              textInput: styles.textInput,
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Search Term:</Text>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Radius:</Text>
          <TextInput
            style={styles.input}
            value={radius}
            onChangeText={setRadius}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Length:</Text>
          <TextInput
            style={styles.input}
            value={length}
            onChangeText={setLength}
          />
        </View>
        {selectedFriendAddress && (
          <Button 
            title="Search Midpoint Locations" 
            onPress={handleSearch} 
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  formContainer: {
    width: '100%',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  textInputContainer: {
    width: '100%',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
});

export default InputSearchMidpointLocations;
