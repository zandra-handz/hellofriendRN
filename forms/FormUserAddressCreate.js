import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { addUserAddress } from '../api'; // Import the addUserAddress function

const FormUserAddressCreate = ({ userId }) => {
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async () => {
    try {
      // Call the addUserAddress function with the user ID and form data
      await addUserAddress(userId, { address, title });
      // Clear form fields after successful submission
      setAddress('');
      setTitle('');
      // Optionally, you can add some feedback to the user here
    } catch (error) {
      console.error('Error adding address:', error);
      // Optionally, handle error states here
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Add Address" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default FormUserAddressCreate;
