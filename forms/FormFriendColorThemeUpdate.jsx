import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { updateFriendFavesColorTheme } from '../api'; // Import the updateFriendFavesColorTheme function
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const FormFriendColorThemeUpdate = forwardRef((props, ref) => { // Forward ref and receive props
  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const [darkColor, setDarkColor] = useState('');
  const [lightColor, setLightColor] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Expose submit method
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const handleSubmit = async () => {
    try {
      const colorThemeData = {
        light_color: lightColor,
        dark_color: darkColor,
        friend: selectedFriend.id,
        user: authUserState.user.id,
      };

      await updateFriendFavesColorTheme(selectedFriend.id, colorThemeData); // Pass friendId to the function

      setDarkColor('');
      setLightColor('');

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating friend color theme:', error);
    }
  };

  return (
    <View style={styles.container}>
      {showSaveMessage && <Text style={styles.saveMessage}>Color theme updated successfully!</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter dark color"
          value={darkColor}
          onChangeText={setDarkColor}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter light color"
          value={lightColor}
          onChangeText={setLightColor}
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

export default FormFriendColorThemeUpdate;
