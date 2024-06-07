import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { validateAddress } from '../api'; // Import the validateAddress function
import { useAuthUser } from '../context/AuthUserContext';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const InputCTDValidateAddress = ({ headerText, onValidationChange }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [validatedText, setValidatedText] = useState('');
  const { selectedFriend } = useSelectedFriend();
  const { authUserState } = useAuthUser();
  const { locationList } = useLocationList();

  useEffect(() => {
    setInputAddress('');
    setSelectedAddress('');
    setValidatedText('');
  }, [locationList]);

  const handleValidation = async () => {
    try {
      console.log("handleValidation for address:", inputAddress);
      const response = await validateAddress(authUserState.user.id, inputAddress);

      if (response.address && response.latitude && response.longitude) {
        onValidationChange(true, response.address, response.latitude, response.longitude);
        setValidatedText(response.address);
      }
      console.log("Validated address: ", response);
    } catch (error) {
      console.error('Error validating address:', error);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedAddress(value);
    setInputAddress('');
    if (value) {
      const selectedOption = locationList.find(location => location.address === value);
      if (selectedOption) {
        const { address, latitude, longitude } = selectedOption;
        onValidationChange(true, address, latitude, longitude);
        setValidatedText(address);
      }
    }
  };

  const handleInputChange = (value) => {
    setInputAddress(value);
    setSelectedAddress('');
    setValidatedText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={inputAddress}
          onChangeText={handleInputChange}
        />
        <Button title="Validate" onPress={handleValidation} />
      </View>
      <Picker
        selectedValue={selectedAddress}
        onValueChange={handleSelectChange}
        style={styles.picker}
      >
        <Picker.Item label="Select saved address" value="" />
        {locationList && locationList.map(location => (
          <Picker.Item key={location.id} label={`${location.title} - ${location.address}`} value={location.address} />
        ))}
      </Picker>
      {validatedText ? (
        <View style={styles.validatedContainer}>
          <Text style={styles.validatedText}>{validatedText}</Text>
          <Button title="Undo" onPress={() => setValidatedText('')} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  validatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  validatedText: {
    flex: 1,
    fontSize: 16,
  },
});

export default InputCTDValidateAddress;
