import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { addFriendAddress } from '../api';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const FormFriendAddressCreate = forwardRef(({ friendId }, ref) => {
  const { authUserState } = useAuthUser();
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const { themeStyles } = useGlobalStyle();
  
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: handleReset,
  }));

  const handleSubmit = async () => {
    try {
      const addressData = {
        title,
        address,
        friend: friendId,
        user: authUserState.user.id,
      };
  
      await addFriendAddress(friendId, addressData);
      handleReset(); 
  
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
  
      return true;  
    } catch (error) {
      console.error('Error adding friend address:', error);
      return false; 
    }
  };


  const handleReset = () => {
    setAddress('');
    setTitle('');
  };
  
  return (
    <View style={styles.container}>
      {showSaveMessage && <Text style={styles.saveMessage}>Address added successfully!</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={themeStyles.input}
          placeholder="Nickname for location" 
          placeholderTextColor="lightgray"
          maxLength={100}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={themeStyles.input}
          placeholder="Address"
          placeholderTextColor="lightgray"
          value={address}
          maxLength={200}
          onChangeText={setAddress}
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
    marginTop: 10,
  },
});

export default FormFriendAddressCreate;
