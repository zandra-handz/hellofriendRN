import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { addFriendAddress } from '../api'; // Import the addFriendAddress function
import { useAuthUser } from '../context/AuthUserContext';

const FormFriendAddressCreate = forwardRef(({ friendId }, ref) => { // Forward ref and receive friendId as a prop
  const { authUserState } = useAuthUser();
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const formRef = useRef();

  // Expose submit method
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const handleSubmit = async () => {
    console.log({ friendId });
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
  
      // Return true for success
      return true;
    } catch (error) {
      console.error('Error adding friend address:', error);
  
      // Return false for failure
      return false;
    }
  };
  
  return (
    <View style={styles.container} ref={formRef}>
      {showSaveMessage && <Text style={styles.saveMessage}>Address added successfully!</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Address"
          value={address}
          onChangeText={setAddress}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Title"
          value={title}
          onChangeText={setTitle}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'center', 
    width: '100%',
  },
  saveMessage: {
    color: 'green',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 10, // Add some spacing between input fields
  },
  input: { 
    borderColor: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    borderWidth: 1, 
    textAlign: 'center', 
    borderRadius: 20,
    padding: 10,
  },
});

export default FormFriendAddressCreate;
