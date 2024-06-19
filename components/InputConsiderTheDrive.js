//'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk'

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GetTravelComparisons } from '../api';
import CardTravelComparison from './CardTravelComparison';
import CardAddressUser from './CardAddressUser';
import CardAddressFriend from './CardAddressFriend';
import { Wander } from 'react-native-animated-spinkit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Hint from './Hint'; 
import HintReady from './HintReady';

const InputConsiderTheDrive = ({ onClose, destinationAddress }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const [ friendAddresses, setFriendAddresses ] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [isChangingSavedUserAddress, setIsChangingSavedUserAddress] = useState(false);
  const [isChangingSavedFriendAddress, setIsChangingSavedFriendAddress] = useState(false);
  const [travelTimeResults, setTravelTimeResults] = useState(null);
  const [travelTimeResultsView, setTravelTimeResultsView] = useState(false);
  const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
  const [showAddressOptions, setShowAddressOptions] = useState(false); // State to manage the visibility of the address options
  const [showFriendAddressOptions, setShowFriendAddressOptions] = useState(false);


  const addressOptions = authUserState.user.addresses ? authUserState.user.addresses.map((address) => ({
    label: address.title,
    value: {
      address: address.address,
      label: address.title,
      lat: address.coordinates[0],
      lng: address.coordinates[1]
    },
  })) : [];
  

  useEffect(() => {
    if (addressOptions && addressOptions.length > 0) {
      const homeAddresses = addressOptions.filter(option => option.label.toLowerCase().includes('home'));
      setSelectedAddress(homeAddresses.length > 0 ? homeAddresses[0].value : addressOptions[0].value);
    }
  }, [authUserState.user.addresses]);




  useEffect(() => {
    if (friendDashboardData && friendDashboardData[0].friend_addresses) {
        console.log('InputConsiderTheDrive: friend addresses targeted');
        const options = friendDashboardData[0].friend_addresses.map(address => ({
            label: address.title,
            value: {
            label: address.address,
            address: address.address,
            lat: address.latitude,
            lng: address.longitude
            }
        }));
        setFriendAddresses(options);
        // Optionally, set the initial selected address
        if (options.length > 0) {
            const friendHomeAddresses = options.filter(option => option.label.toLowerCase().includes('home'));
            setSelectedFriendAddress(friendHomeAddresses.length > 0 ? friendHomeAddresses[0].value : options[0].value);
        }
    } else {
      console.log('InputConsiderTheDrive: no friend addresses found');
    }
}, [friendDashboardData, selectedFriend]);

  const handleToggleUserAddress = () => {
    setIsChangingSavedUserAddress(prevState => !prevState); 
  };

  const handleToggleFriendAddress = () => {
    setIsChangingSavedFriendAddress(prevState => !prevState); 
  };

  const handleBackButtonPress = async () => {
    setTravelTimeResultsView(false);
  };

  const handleGetTravelData = async () => {
    setIsLoading(true);
    try {
      const locationData = {
        address_a_address: selectedAddress.address,
        address_a_lat: parseFloat(selectedAddress.lat),  
        address_a_long: parseFloat(selectedAddress.lng),  
        address_b_address: selectedFriendAddress.label,
        address_b_lat: parseFloat(selectedFriendAddress.lat),  
        address_b_long: parseFloat(selectedFriendAddress.lng), 
        destination_address: destinationAddress.address,
        destination_lat: parseFloat(destinationAddress.latitude), 
        destination_long: parseFloat(destinationAddress.longitude),  
        search: 'coffee', // Assuming default value for now
        radius: 500, // Assuming default value for now
        length: 8, // Assuming default value for now
        perform_search: false, // Assuming default value for now
      };

      console.log(locationData)

      const results = await GetTravelComparisons(locationData);
      console.log(results.compare_directions);
      setTravelTimeResults(results.compare_directions);
      setTravelTimeResultsView(true);
      console.log("Travel comparisons requested successfully");
    } catch (error) {
      console.error("Error getting travel comparisons:", error);
    }
    setIsLoading(false);
  };

  
  const handleAddressSelect = (userAddress) => {
    console.log("handleUserAddressSelect called with:", userAddress);
    setSelectedAddress(userAddress); 
    //setShowAddressOptions(false); // Close the address options dropdown after selection
  };


  const handleFriendAddressSelect = (friendAddress) => {
    console.log("handleFriendAddressSelect called with:", friendAddress);
    setSelectedFriendAddress(friendAddress); 
    setShowAddressOptions(false); // Close the address options dropdown after selection
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <Wander color={'hotpink'}/>
        </View>
      ) : (
        <>
          {destinationAddress && destinationAddress.title ? (
            <>
              <View style={styles.destinationContainer}>
                <Text style={styles.title}>{destinationAddress.title}</Text>
                <Text style={styles.address}>{destinationAddress.address}</Text>
              </View>
              <View style={styles.formContainer}>
                {!travelTimeResultsView ? (
                  <>
                    <View style={styles.section}>
                      <View style={styles.cardComparisonCardtridge}>




                      <View style={styles.cardSide}>
  <Text style={styles.cardTitle} fLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
    Me
  </Text>

  {selectedAddress ? (
    <> 
    <>
      <View style={styles.hintContainer}>
        <HintReady 
          message={
            isChangingSavedUserAddress 
              ? (`${selectedAddress.address}`)
              : `Press to edit address`
          }
          icon={isChangingSavedUserAddress ? 'pencil' : 'check-circle'}
          onPress={handleToggleUserAddress}
          />
      </View>
      </> 
    </>
  ) : (
    <>
    <View style={styles.hintContainer}>
      <Hint 
        message={
          isChangingSavedUserAddress 
            ? (selectedFriendAddress ? selectedFriendAddress : 'No address selected')
            : 'Please select a starting address.'
        }
        icon={isChangingSavedUserAddress ? 'pencil' : 'exclamation-circle'}
        onPress={handleToggleUserAddress}
      />
      <TouchableOpacity onPress={handleToggleUserAddress}>
        <Text style={styles.toggleButton}>
          {isChangingSavedUserAddress ? 'Back' : 'Enter address'}
        </Text>
      </TouchableOpacity>
    </View>
    </>
  )}

  {isChangingSavedUserAddress && (
    <View style={styles.editScreen}>
      <Text style={styles.addressText}>{selectedAddress ? selectedAddress.label : ''}</Text>
      <View style={styles.searchIconContainer}>
      <View style={styles.pickerContainer}>
        <Text style={styles.hardcodedLabel}>Saved</Text>  
        <Picker
          selectedValue={selectedAddress ? selectedAddress.label : null}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => {
            const newUserAddress = addressOptions.find(option => option.label === itemValue).value;
            setSelectedAddress(newUserAddress);
          }}
        >
          {addressOptions.map(option => (
            <Picker.Item key={option.label} label={option.label} value={option.label} />
          ))}

        </Picker>
      </View>
        <TouchableOpacity onPress={() => setShowAddressOptions(true)}> 
            <FontAwesome name="search" size={24} color="#000" />
        </TouchableOpacity> 
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddressOptions}
        onRequestClose={() => setShowAddressOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}> 
          <GooglePlacesAutocomplete
            placeholder="Search"
            keepResultsAfterBlur={true}
            onPress={(data, details = null) => {
              const userAddress = {
                title: data.description,
                address: data.description,
                label: data.description,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              };
              handleAddressSelect(userAddress);
              setShowAddressOptions(false); // Close modal after selecting an address
            }}
            fetchDetails={true}
            query={{
              key: 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk', // Replace with your actual Google Maps API key
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
          <Button title="Close" onPress={() => setShowAddressOptions(false)} />
        </View>
        </View>
      </Modal>
    </View>
  )}
</View>




                        <View style={styles.cardDivider} />
  





                        <View style={styles.cardSide}>
                          <Text style={styles.cardTitle} fLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
                            {selectedFriend ? selectedFriend.name : 'My friend'}
                          </Text>
    
                          {selectedFriendAddress ? (
                            <> 
                            <>
                              <View style={styles.hintContainer}>
                                <HintReady 
                                  message={
                                    isChangingSavedFriendAddress 
                                      ? (`${selectedFriendAddress.address}`)
                                      : `Press to edit address`
                                  }
                                  icon={isChangingSavedFriendAddress ? 'pencil' : 'check-circle'}
                                  onPress={handleToggleFriendAddress}
                                  />
                              </View>
                              </> 
                            </>
                          ) : (
                            <>
                          <View style={styles.hintContainer}>
                            <Hint 
                              message={
                                isChangingSavedFriendAddress 
                                  ? (selectedFriendAddress ? selectedFriendAddress : 'Add address:')
                                  : 'Please select a starting address.'
                              }
                              icon={isChangingSavedFriendAddress ? 'pencil' : 'exclamation-circle'}
                              onPress={handleToggleFriendAddress}
                            />
                            </View>
                            </>
                          )}
  
                          {isChangingSavedFriendAddress && (
                            <View style={styles.editScreen}>
                              <Text style={styles.addressText}>{selectedFriendAddress ? selectedFriendAddress.label : ''}</Text>
                              <View style={styles.searchIconContainer}>
                              <View style={styles.pickerContainer}>
                              {friendAddresses && friendAddresses.length > 0 && (
                                <>
                                <Text style={styles.hardcodedLabel}>Saved</Text> 
                                <Picker
                                  selectedValue={selectedFriendAddress ? selectedFriendAddress.label : null}
                                  style={styles.picker}
                                  onValueChange={(itemValue, itemIndex) => {
                                    const newFriendAddress = friendAddresses.find(option => option.label === itemValue).value;
                                    setSelectedFriendAddress(newFriendAddress);
                                  }}
                                >
                                  {friendAddresses.map(option => (
                                    <Picker.Item key={option.label} label={option.label} value={option.label} />
                                  ))}
                                </Picker>
                                </>
                              )}
                              </View> 
                                <TouchableOpacity onPress={() => setShowAddressOptions(true)}>
                                  <FontAwesome name="search" size={24} color="#000" />
                                </TouchableOpacity>
                              </View>
                              
                              <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showAddressOptions}
                                onRequestClose={() => setShowAddressOptions(false)}
                              >
                                <View style={styles.modalContainer}>
                                  <View style={styles.modalContent}> 
                                  <GooglePlacesAutocomplete
                                    placeholder="Search"
                                    keepResultsAfterBlur={true}
                                    onPress={(data, details = null) => {
                                      const friendAddress = {
                                        title: data.description,
                                        address: data.description,
                                        label: data.description,
                                        lat: details.geometry.location.lat,
                                        lng: details.geometry.location.lng,
                                      };
                                      handleFriendAddressSelect(friendAddress);
                                      setShowAddressOptions(false); // Close modal after selecting an address
                                    }}
                                    fetchDetails={true}
                                    query={{
                                      key: 'AIzaSyBAW09hdzlszciQ4fTiZjfxcVMlEkF5Iqk', // Replace with your actual Google Maps API key
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
                                  <Button title="Close" onPress={() => setShowAddressOptions(false)} />
                                </View>
                                </View>
                              </Modal>
                            </View>
                          )}
                        </View>





                      </View>
                    </View>
                  </>
                ) : (
                  <> 
                    <TouchableOpacity onPress={handleBackButtonPress} style={styles.editButtonRight}>
                      <FontAwesome5 name="arrow-left" size={20} color="#000" />
                    </TouchableOpacity>
                    {travelTimeResults && (
                      <CardTravelComparison
                        myData={{
                          time: travelTimeResults.Me ? travelTimeResults.Me.duration : 'N/A',
                          miles: travelTimeResults.Me ? travelTimeResults.Me.distance : 'N/A',
                        }}
                        friendData={{
                          time: travelTimeResults.friend ? travelTimeResults.friend.duration : 'N/A',
                          miles: travelTimeResults.friend ? travelTimeResults.friend.distance : 'N/A',
                        }}
                      />
                    )}
                  </>
                )}
              </View>
              {selectedAddress && selectedFriendAddress && (
              <TouchableOpacity style={styles.editButton} onPress={handleGetTravelData}>
                <Text>Find Route</Text>
              </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.message}>Please select a destination address to calculate travel times.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
  
  
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: 'white',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flexGrow: 1,
    width: '100%',
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    paddingBottom: 6,
    color: 'hotpink',
    
  },
  address: {
    fontSize: 16, 
  },
  destinationContainer: {
    marginBottom: 28,
    marginTop: 16,
    alignItems: 'left',
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
  searchIconContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 2,
    borderWidth: 1,
    justifyContents: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 8, 
    height: 36,
  },
  pickerContainer: {
    position: 'relative',
    width: '100%',
  },
  picker: {
    width: '100%',
    opacity: 0, // Hide the Picker text
  },
  hardcodedLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    fontSize: 12, // Change the hardcoded label text size here
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10, // Adjust padding as needed
  },
  textInputContainer: {
    width: '100%',
  },
  dropDownButton: {
    fontWeight: 'bold',
    width: '100%',
    color: 'pink',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: '50%',
    position: 'relative',
  },
  addressInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '20%',
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  resultsContainer: {},
  message: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 20,
  },
  pinFeatureContainer: {},
  cardComparisonCardtridge: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'lightgray',
    padding: 16,
    marginVertical: 8,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  hintContainer: {
    justifyContent: 'top',
    alignItems: 'top',
    height: 100,
  },
  addressText: {
    fontWeight: 'bold',
    height: 0,
    marginTop: 0,
    
  },
  cardSide: {
      flex: 1,
      alignItems: 'center',
      paddingRight: 0,
      paddingLeft: 6,
      height: 160,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8, 
  },
  cardTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
  },
  cardTime: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      marginLeft: 8,
  },
  cardMiles: {
      fontSize: 14,
      color: 'black',
  },
  cardDivider: {
      width: 1,
      backgroundColor: '#ccc',
      marginHorizontal: 12, 
  },
  editScreen: {
    flex: 1, 

  },
});

export default InputConsiderTheDrive;