import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ButtonDirections from '../components/ButtonDirections';


import { GOOGLE_API_KEY } from '@env';



const SelectorAddressBase = ({ addresses, onAddressSelect, contextTitle }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [localAddressOptions, setLocalAddressOptions] = useState([]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const options = addresses.map((address) => ({
        label: address.title,
        value: {
          address: address.address,
          label: address.title,
          lat: address.coordinates ? address.coordinates[0] : address.latitude,
          lng: address.coordinates ? address.coordinates[1] : address.longitude,
        },
      }));
      setLocalAddressOptions(options);
      console.log('SelectorAddressBase options: ',options);

      // Default to the first address if available
      setSelectedAddress(options[0].value);
      onAddressSelect(options[0].value); // Automatically select the first address
    }
    console.log(addresses);
  }, [addresses]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    onAddressSelect(address);
    setShowAddressOptions(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>{contextTitle}</Text>

      <View style={styles.hintContainer}>
        {selectedAddress && (
          <ButtonDirections address={selectedAddress.address} size={15} />
        )}
        <Text style={styles.hintText}>
          {selectedAddress ? '' : 'No address selected'}
        </Text>
        <FontAwesome
          name={isEditingAddress ? 'pencil' : 'check-circle'}
          size={24}
          color="limegreen"
          onPress={() => setIsEditingAddress(prev => !prev)}
          style={styles.icon}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditingAddress}
        onRequestClose={() => setIsEditingAddress(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.addressText}>{selectedAddress ? selectedAddress.label : ''}</Text>
            
            <View style={styles.searchIconContainer}>
              <View style={styles.pickerContainer}>
                <Text style={styles.hardcodedLabel}>Saved Addresses</Text>
                <Picker
                  selectedValue={selectedAddress ? selectedAddress.label : null}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    const newAddress = localAddressOptions.find(option => option.label === itemValue).value;
                    setSelectedAddress(newAddress);
                    onAddressSelect(newAddress);
                  }}
                >
                  {localAddressOptions.map(option => (
                    <Picker.Item key={option.label} label={option.label} value={option.label} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setShowAddressOptions(true)}
              >
                <FontAwesome name="search" size={24} color="limegreen" />
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
                      const address = {
                        title: data.description,
                        address: data.description,
                        label: data.description,
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng,
                      };
                      handleAddressSelect(address);
                    }}
                    fetchDetails={true}
                    query={{
                      key: GOOGLE_API_KEY,
                      language: 'en',
                    }}
                    debounce={300}
                    styles={{
                      textInputContainer: styles.textInputContainer,
                      textInput: styles.textInput,
                      predefinedPlacesDescription: {
                        color: 'limegreen',
                      },
                    }}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowAddressOptions(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsEditingAddress(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  hintText: {
    fontSize: 16,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 18,
    marginBottom: 20,
  },
  searchIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pickerContainer: {
    flex: 1,
  },
  hardcodedLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  searchButton: {
    marginLeft: 10,
  },
  textInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'limegreen',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SelectorAddressBase;
