// 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk'
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const InputGoogleSearchAddress = ({ onAddressSelected }) => {
  const handleGooglePress = (data, details = null) => {
    console.log("Address selected"); // Log whenever an address is selected
    if (details) {
      const { formatted_address } = details;
      console.log('Selected Address:', formatted_address); // Log selected address
      onAddressSelected(formatted_address); 
      console.log(addressSelected);// Pass the selected address to the parent component
    }
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
        onPress={handleGooglePress}
        query={{
          key: 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk', // Replace with your Google API key
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
    paddingRight: 0,
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
    borderWidth: 1,
    borderColor: 'white',
    maxHeight: 200,
    zIndex: 1,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});

export default InputGoogleSearchAddress;
