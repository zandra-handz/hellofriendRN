import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GOOGLE_API_KEY } from '@env';

const SearchGoogleAddressFloating = ({ onAddressSelect }) => {
  const [listViewDisplayed, setListViewDisplayed] = useState(true);
  const googlePlacesRef = useRef(null);

  const handlePress = (data, details = null) => {
    if (details) {
      const newAddress = {
        address: details.formatted_address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        title: details.name || 'Search',
      };

      onAddressSelect(newAddress);
    }
    setListViewDisplayed(false);
  };

  useEffect(() => {
    if (!listViewDisplayed) {
      googlePlacesRef.current?.setAddressText('');
    }
  }, [listViewDisplayed]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 0, 
    width: '100%', 
  },
  textInputContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',   
    marginTop: 0,
    alignContent: 'center',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 2, 
    minWidth: 290,
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
    borderWidth: 1,
    borderColor: 'white',
    maxHeight: 300,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});

export default SearchGoogleAddressFloating;
