import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useLocationList } from '../context/LocationListContext'; // Adjust the import path as necessary

import ItemViewLocation from '../components/ItemViewLocation';
import { GOOGLE_API_KEY } from '@env';

const InputSearchAddress = () => {
  const { locationList, setLocationList, setSelectedLocation, selectedLocation } = useLocationList();
  
  const [listViewDisplayed, setListViewDisplayed] = useState(true); // State to control list view visibility
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  
  const googlePlacesRef = useRef(null); // Reference to the GooglePlacesAutocomplete component

  const generateTemporaryId = () => {
    return `temp_${Date.now()}`; // Use timestamp to generate a unique temporary ID
  };

  const handlePress = (data, details = null) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const newLocation = {
        id: generateTemporaryId(), // Generate temporary ID here
        address: details.formatted_address,
        latitude: lat,
        longitude: lng,
        notes: '',
        title: details.name || 'Search', // Use the name from the details object
        validatedAddress: true,
        friendsCount: 0,
        friends: [],
      };

      setLocationList([newLocation, ...locationList]); // Add new location to the beginning of the list
      setSelectedLocation(newLocation); // Set the selected location
      console.log('New Location Added:', newLocation);

      setIsLocationModalVisible(true); // Show the ItemViewLocation modal
    }
    setListViewDisplayed(false); // Hide the list view after selection
  };

  useEffect(() => {
    if (!listViewDisplayed) {
      // If the list view is not displayed, clear the input
      googlePlacesRef.current?.setAddressText('');
    }
  }, [listViewDisplayed]);

  const closeModal = () => {
    setIsLocationModalVisible(false); // Hide the ItemViewLocation modal
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Search"
        minLength={2}
        autoFocus={true}
        returnKeyType={'search'}
        listViewDisplayed={listViewDisplayed}  
        fetchDetails={true}
        keepResultsAfterBlur={true}
        onPress={handlePress}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
        renderRightButton={() => (
          <FontAwesome5 name="search" size={22} color="gray" style={styles.searchIcon} />
        )}
      />
      {selectedLocation && isLocationModalVisible && (
        <ItemViewLocation location={selectedLocation} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 1, // Ensure the container is above other elements if necessary
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 2, // Add padding to the right to make space for the icon
  },
  textInput: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1.4,
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: '18%',
  },
  listView: {
    backgroundColor: 'white',
    marginTop: -4,
    borderRadius: 30,
    borderWidth: 1, // Add border to debug visibility
    borderColor: 'white', // Border color for visibility
    maxHeight: 600, // Set the maximum height for the list view
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});

export default InputSearchAddress;
