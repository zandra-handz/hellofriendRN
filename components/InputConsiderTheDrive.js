import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GetTravelComparisons } from '../api';

const InputConsiderTheDrive = ({ onClose, destinationAddress }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [toggleAddressEditText, settoggleAddressEditText] = useState('Change my starting address');
  const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);

  const addressOptions = authUserState.user.addresses.map((address) => ({
    label: address.title,
    value: {
      address: address.address,
      label: address.title, // Added label to the value object
      lat: address.coordinates[0], 
      lng: address.coordinates[1]
    },
  }));

  const handleToggleUserAddress = () => {
    setIsChangingAddress(prevState => !prevState); 
    
  };

  const handleGetRoute = async () => {
    try {
      const locationData = {
        address_a_address: selectedAddress.address,
        address_a_lat: parseFloat(selectedAddress.lat), // Ensure latitude is a float
        address_a_long: parseFloat(selectedAddress.lng), // Ensure longitude is a float
        address_b_address: selectedFriendAddress.label,
        address_b_lat: parseFloat(selectedFriendAddress.lat), // Ensure latitude is a float
        address_b_long: parseFloat(selectedFriendAddress.lng), // Ensure longitude is a float
        destination_address: destinationAddress.address,
        destination_lat: parseFloat(destinationAddress.latitude), // Ensure latitude is a float
        destination_long: parseFloat(destinationAddress.longitude), // Ensure longitude is a float
        search: 'coffee', // Assuming default value for now
        radius: 500, // Assuming default value for now
        length: 8, // Assuming default value for now
        perform_search: false, // Assuming default value for now
      };

      console.log(locationData)

      await GetTravelComparisons(locationData);
      console.log("Travel comparisons requested successfully");
    } catch (error) {
      console.error("Error getting travel comparisons:", error);
    }
  };

  const handleButtonPress = async () => {
    console.log("Starting Address:", selectedAddress.lat, selectedAddress.lng);
    console.log("Selected Friend's Address:", selectedFriendAddress.lat, selectedFriendAddress.lng);
    console.log("Destination Address:", destinationAddress.latitude, destinationAddress.longitude);
    await handleGetRoute();
  };

  useEffect(() => {
    if (addressOptions.length > 0) {
      const homeAddresses = addressOptions.filter(option => option.label.toLowerCase().includes('home'));
      setSelectedAddress(homeAddresses.length > 0 ? homeAddresses[0].value : addressOptions[0].value);
    }
  }, [authUserState.user.addresses]);

  useEffect(() => {
    // Set destinationAddress when the component mounts
    setSelectedAddress(destinationAddress);
  }, []);

  const handleFriendAddressSelect = (friendAddress) => {
    console.log("handleFriendAddressSelect called with:", friendAddress);
    setSelectedFriendAddress(friendAddress); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.destinationContainer}>
        <Text style={styles.title}>{destinationAddress ? destinationAddress.title : ""}</Text>
        <Text style={styles.address}>{destinationAddress ? destinationAddress.address : ""}</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.subtitle}>{selectedFriend ? selectedFriend.name : "My friend"} is coming from</Text>
          <GooglePlacesAutocomplete
            placeholder="Search"
            keepResultsAfterBlur={true}
            onPress={(data, details = null) => {
              console.log("GooglePlacesAutocomplete onPress called with:", data, details);
              const friendAddress = {
                label: data.description, // Store address label
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
        {isChangingAddress ? (
          <View style={styles.editSection}>
            <Picker
              selectedValue={selectedAddress}
              onValueChange={(value) => setSelectedAddress(value)}
              style={styles.picker}
            >
              {addressOptions.map((address, index) => (
                <Picker.Item label={address.label} value={address.value} key={index} />
              ))}
            </Picker> 
            <TouchableOpacity onPress={handleToggleUserAddress} style={styles.editButton}>
              <FontAwesome5 name="check" size={14} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editSection}>
            <Text style={styles.subtitle}>I'm coming from {selectedAddress ? selectedAddress.label : ''}</Text>
            <TouchableOpacity onPress={handleToggleUserAddress} style={styles.editButton}>
              <FontAwesome5 name="edit" size={14} color="black" />
            </TouchableOpacity>
          </View>
        )}
        {selectedFriendAddress && (
          <Button 
            title="Get Route" 
            onPress={handleButtonPress} 
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
    backgroundColor: 'white',
  },
  formContainer: {
    width: '100%',
  },
  section: {
    marginBottom: 20,
  },
  editSection: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold', 
    paddingBottom: 6,
  },
  address: {
    fontSize: 16,  
  },
  destinationContainer: {
    marginBottom: 36,
  },
  subtitle: {
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
    width: '75%',
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
  editButton: {
    marginLeft: 3,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  editButtonRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default InputConsiderTheDrive;
