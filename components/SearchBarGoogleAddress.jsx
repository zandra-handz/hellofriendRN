import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useNavigation } from '@react-navigation/native';


import { GOOGLE_API_KEY } from '@env';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const SearchBarGoogleAddress = () => {
  const { locationList, setTempLocationList, tempLocationList } = useLocationFunctions();
  const navigation = useNavigation();
  const [ selectedLocation, setSelectedLocation ] = useState();
  const [listViewDisplayed, setListViewDisplayed] = useState(true);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const googlePlacesRef = useRef(null);
 

  const generateTemporaryId = () => {
    return `temp_${Date.now()}`;
  };

  const handlePress = (data, details = null) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const newLocation = {
        id: generateTemporaryId(),
        address: details.formatted_address,
        latitude: lat,
        longitude: lng,
        notes: '',
        title: details.name || 'Search',
        validatedAddress: true,
        friendsCount: 0,
        friends: [],
      };
 
      //setSelectedLocation(newLocation);
      //setTempLocationList((prevTempLocationList) => [newLocation, ...prevTempLocationList]);
         
      
      handleGoToLocationViewScreen(newLocation);
    }
    setListViewDisplayed(false);
  };

  const handleGoToLocationViewScreen = (location) => { 
    navigation.navigate('Location', { location: location });
 
  }; 

  useEffect(() => {
    if (!listViewDisplayed) {
      googlePlacesRef.current?.setAddressText('');
    }
  }, [listViewDisplayed]);

  const closeModal = () => {
    setIsLocationModalVisible(false);
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
          key: 'AIzaSyAY-lQdQaVSKpPz9h2GiX_Jde47nv3FsNg',
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
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 2,
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

export default SearchBarGoogleAddress;
