import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { addUserAddress } from '../calls/api';  
import { useGlobalStyle } from '../context/GlobalStyleContext';

const FormUserAddressCreate = forwardRef(({ userId }, ref) => {
  const { addAddress } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: handleReset,
  }));

  const handleSubmit = async () => {
    try {
      const addressData = {
        title: title,
        address: address,
      };
      response = await addUserAddress(userId, addressData);
      console.log('handleSubmit add user address in form reponse:', response);
      addAddress(title, address);
      handleReset(); 
      
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000); 

      return true;

    } catch (error) {
      console.error('Error adding address:', error); 
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

export default FormUserAddressCreate;
