//'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk'

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import ItemGoogleAddress from './ItemGoogleAddress';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { GoogleAutoComplete } from 'react-native-google-autocomplete'; // Importing from the installed package

const InputConsiderTheDrive = ({ onClose, destinationAddress, updateFriendAddress }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [locationResults, setLocationResults] = useState([]);

  const addressOptions = authUserState.user.addresses.map((address) => ({
    label: address.title,
    value: address.title,
  }));

  const handlePress = (description) => {
    setSelectedFriendAddress(description);  // Update selected friend's address in parent component
    console.log(description);
    searchInputValue(description); // Update input value with the selected address
    setLocationResults([]); // Clear the location results to close the menu
  };

  useEffect(() => {
    const homeAddresses = addressOptions.filter(option => option.label.toLowerCase().includes('home'));
    if (homeAddresses.length > 0) {
      setSelectedAddress(homeAddresses[0].value);
    } else if (addressOptions.length > 0) {
      setSelectedAddress(addressOptions[0].value);
    }
  }, [addressOptions]);

  // Function to handle the selection of a friend's address
  const handleFriendAddressSelect = (friendAddress) => {
    setSelectedFriendAddress(friendAddress);
    console.log("Selected friend's address updated:", friendAddress);
    updateFriendAddress(friendAddress); // Update selected friend's address in parent component
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
          <GoogleAutoComplete apiKey="AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk" debounce={300}>
          {({ searchInputValue, handleTextChange, locationResults, fetchDetails }) => (
        <React.Fragment>
          <TextInput
            style={styles.textInput}
            value={searchInputValue}
            onChangeText={handleTextChange}
            placeholder="Location..."
          />
          <ScrollView style={styles.listView}>
            {locationResults.map((el, i) => (
              <TouchableOpacity key={String(i)} onPress={() => handlePress(el.description)} style={styles.touchableOpacity}>
               
                <Text>{el.description}</Text>
                <Text>{el.place_id}</Text>
                
              </TouchableOpacity>
            ))}
          </ScrollView>
        </React.Fragment>
      )}
        </GoogleAutoComplete>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Destination:</Text>
          <TextInput
            style={styles.input}
            value={destinationAddress ? destinationAddress.title : ""}
            editable={false}
          />
        </View>
        <Button 
          title="Get Route" 
          onPress={() => {
            console.log("Starting Address:", selectedAddress);
            console.log("Selected Friend's Address:", selectedFriendAddress);
            console.log("Destination Address:", destinationAddress);
            onClose(selectedAddress, selectedFriendAddress, destinationAddress);
          }} />
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
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    maxHeight: 200,
    zIndex: 1,
  },
  touchableOpacity: {
    paddingVertical: 10, // Add vertical padding
    paddingHorizontal: 20, // Add horizontal padding
    borderBottomWidth: 1, // Add bottom border
    borderBottomColor: 'lightgray', // Border color
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
});

export default InputConsiderTheDrive;
