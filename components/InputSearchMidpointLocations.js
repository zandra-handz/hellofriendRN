import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useAuthUser } from '../context/AuthUserContext';
import { CheckBox } from 'react-native-elements'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CardCheckboxMidpointLocation from './CardCheckboxMidpointLocation';
import { SearchForMidpointLocations } from '../api';
import InputAddLocationQuickSave from './InputAddLocationQuickSave';
import AlertSmall from './AlertSmall';
import { Wander } from 'react-native-animated-spinkit';
import { Plane, Chase, Bounce, Wave, Pulse, Flow, Swing, Circle, CircleFade, Grid, Fold } from 'react-native-animated-spinkit';

const InputSearchMidpointLocations = ({ onClose }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
  const [search, setSearch] = useState('coffee');
  const [radius, setRadius] = useState('500');
  const [length, setLength] = useState('8'); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResultView, setSearchResultView] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [selectedMidpointLocations, setSelectedMidpointLocations] = useState([]); 
  const [selectedItem, setSelectedItem] = useState(null);

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
    setIsLoading(true);
    try {
      const locationData = {
        address_a_address: selectedAddress.address.toString(),
        address_b_address: selectedFriendAddress.label.toString(),
        search: search,
        radius: parseFloat(radius),
        length: parseFloat(length),
      };

      
      const results = await SearchForMidpointLocations(locationData);
      setSearchResults(results);
      setSearchResultView(true);
      console.log(results[2]);
      console.log(results.length);
      console.log(Array.isArray(results));
      console.log("Midpoint locations search requested successfully: ", searchResults);
    } catch (error) {
      console.error("Error searching for midpoint locations:", error);
    }
    setIsLoading(false);
  };



  useEffect(() => {
    // This effect will run every time searchResults is updated
    if (searchResults !== null) {
      console.log("Midpoint locations search requested successfully: ", searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    if (addressOptions.length > 0) {
      const homeAddresses = addressOptions.filter(option => option.label.toLowerCase().includes('home'));
      setSelectedAddress(homeAddresses.length > 0 ? homeAddresses[0].value : addressOptions[0].value);
    }
  }, [authUserState.user.addresses]);

  const handleFriendAddressSelect = (friendAddress) => {
    setSelectedFriendAddress(friendAddress); 
  };
  
  const handleSaveLocation = (item) => {
    console.log('handleSaveLocation pressed for item:', item);
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleBackButtonPress = async () => {
    setSearchResultView(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <View style={styles.formContainer}>
          <View style={styles.spinnerContainer}>
            <Wander size={48} color='hotpink' />
          </View>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {!searchResultView ? (
            <>
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
                      lng: details.geometry.location.lng,
                    };
                    setSelectedFriendAddress(friendAddress);
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
            </>
          ) : (
            <View style={styles.resultsContainer}>
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <>
                    <TouchableOpacity onPress={() => handleSaveLocation(item)}>
                      <CardCheckboxMidpointLocation
                        name={item.name}
                        address={item.address}
                        mydistance={item.distances[0].Me}
                        frienddistance={item.distances[1].friend}
                        mytraveltime={item.travel_times[0].Me}
                        friendtraveltime={item.travel_times[1].friend}
                      />
                    </TouchableOpacity>
                  </>
                )}
                keyExtractor={(location, index) => index.toString()}
              />
              <Button 
                title="Go back" 
                onPress={handleBackButtonPress} 
              />
            </View>
          )}
          {selectedItem && (
            <AlertSmall
              isModalVisible={isModalVisible}
              toggleModal={closeModal}
              modalContent={
                <InputAddLocationQuickSave
                  onClose={closeModal}
                  title={selectedItem.name}
                  address={selectedItem.address}
                />
              }
              modalTitle={'Save Location'}
            />
          )}
        </View>
      )}
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
  spinnerContainer: {
    flex: 1,
    marginTop: '42%',
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
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
  resultsContainer: { 
  },

});

export default InputSearchMidpointLocations;
