import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { addFriendAddress } from '../api'; // Import the addFriendAddress function
import { useAuthUser } from '../context/AuthUserContext';

const FormFriendAddressCreate = ({ friendId }) => { // Receive friendId as a prop
  const { authUserState } = useAuthUser();
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSubmit = async () => {
    console.log({friendId});
    try {
      const addressData = {
        title: title,
        address: address,
        friend: friendId,
        user: authUserState.user.id,
      };

      
      await addFriendAddress(friendId, addressData); // Pass friendId to the function

      setAddress('');
      setTitle('');

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding friend address:', error);
    }
  };

  return (
    <View style={styles.container}>
      {showSaveMessage && <Text style={styles.saveMessage}>Address added successfully!</Text>}
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
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  saveMessage: {
    color: 'green',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default FormFriendAddressCreate;
