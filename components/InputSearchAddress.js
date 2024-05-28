import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useLocationList } from '../context/LocationListContext'; // Adjust the import path as necessary

const InputSearchAddress = ({ onClose }) => {
  const { locationList, setLocationList } = useLocationList();

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
        friends: []
      };

      setLocationList([newLocation, ...locationList]); // Add new location to the beginning of the list
      console.log('New Location Added:', newLocation);
    }
    onClose();
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Enter Address"
        minLength={2}
        autoFocus={true}
        returnKeyType={'search'}
        listViewDisplayed="auto"
        fetchDetails={true}
        onPress={handlePress}
        query={{
          key: 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk',
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
          <FontAwesome5 name="search" size={16} color="gray" style={styles.searchIcon} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  textInputContainer: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 0, // Add padding to the right to make space for the icon
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: 10,
  },
  listView: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1, // Add border to debug visibility
    borderColor: 'white', // Border color for visibility
    maxHeight: 200, // Set the maximum height for the list view
    zIndex: 1, // Ensure the list view is above other elements if necessary
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});

export default InputSearchAddress;
