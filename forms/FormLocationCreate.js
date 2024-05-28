import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { createLocation } from '../api'; // Import the createLocation function
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';

const FormLocationCreate = ({ onLocationCreate }) => {
    
  const { authUserState } = useAuthUser();
  const { friendList } = useFriendList();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [personalExperience, setPersonalExperience] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleFriendSelect = (friendId) => {
    const updatedFriends = selectedFriends.includes(friendId)
      ? selectedFriends.filter(id => id !== friendId)
      : [...selectedFriends, friendId];
    setSelectedFriends(updatedFriends);
  };

  const handleSubmit = async () => {
    try {
      const locationData = {
        title: title,
        address: address,
        personal_experience_info: personalExperience,
        user: authUserState.user.id,
        friends: selectedFriends
      };
      const res = await createLocation(locationData); // Use the createLocation function from the api file
      onLocationCreate(res);
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Location</Text>
      {showSaveMessage && <Text style={styles.saveMessage}>Location created successfully!</Text>}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder='Title'
      />
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder='Address'
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={personalExperience}
        onChangeText={setPersonalExperience}
        placeholder='Personal Experience Info'
        multiline
        numberOfLines={4}
      />
      <View style={styles.friendCheckboxesContainer}>
        {friendList.map((friend, index) => (
          <CheckBox
            key={index}
            title={friend.name}
            checked={selectedFriends.includes(friend.id)}
            onPress={() => handleFriendSelect(friend.id)}
          />
        ))}
      </View>
      <Button title='Create Location' onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top', // For multiline TextInput alignment
  },
  friendCheckboxesContainer: {
    marginBottom: 10,
  },
});

export default FormLocationCreate;
