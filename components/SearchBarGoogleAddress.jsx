import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useNavigation } from '@react-navigation/native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import GoogleLogoSvg from '../assets/svgs/google-logo.svg';

import { GOOGLE_API_KEY } from '@env';
import { useQueryClient } from '@tanstack/react-query';


const SearchBarGoogleAddress = ({onPress}) => {
  const { themeStyles } = useGlobalStyle();  const navigation = useNavigation();
   const [listViewDisplayed, setListViewDisplayed] = useState(true);

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

      onPress(newLocation);
      //handleGoToLocationViewScreen(newLocation); 
      googlePlacesRef.current?.setAddressText('');
    }
    googlePlacesRef.current?.setAddressText('');
  };

  const handleGoToLocationViewScreen = (location) => { 
    navigation.navigate('Location', { location: location });
 
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
        placeholder="Search Google maps"
        textInputProps={{
          placeholderTextColor: themeStyles.genericText.color,
          returnKeyType: "search"
        }}
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
          textInputContainer: [styles.inputContainer, themeStyles.genericTextBackground],
          textInput: [styles.inputContainer, themeStyles.genericText, { placeholderTextColor: 'white' }],
          listView: [themeStyles.genericTextBackground],
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={200}
        renderRightButton={() => (
          <GoogleLogoSvg width={24} height={24} style={styles.iconStyle} />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    alignContent: 'center',  
    borderRadius: 30,
    height: 48,
    backgroundColor: 'transparent', 
    //fontFamily: 'Poppins-Regular',
    paddingTop: 5,
     
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
  iconStyle: {
    marginRight: 10,
    marginBottom: 6,

  },
});

export default SearchBarGoogleAddress;
