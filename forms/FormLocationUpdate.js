import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { updateLocation } from '../api'; // Import the updateLocation function
import { useAuthUser } from '../context/AuthUserContext';
import { useLocationList } from '../context/LocationListContext';
import { useFriendList } from '../context/FriendListContext';

const FormLocationUpdate = ({ onLocationUpdate, location }) => {
  const { authUserState } = useAuthUser();
  const { friendList } = useFriendList();
  const { locationList, setLocationList } = useLocationList();

  const { id, title: initialTitle, address, notes, latitude, longitude, friends } = location;

  // Log the friends prop to check its value
  useEffect(() => {
    console.log('Friends prop:', friends);
  }, [friends]);

  // Initialize selectedFriends with an empty array if location.friends is undefined
  const initialSelectedFriends = Array.isArray(friends) ? friends : [];
  const [formTitle, setFormTitle] = useState(initialTitle); // Renamed to formTitle to avoid conflict
  const [personalExperience, setPersonalExperience] = useState(location.personal_experience_info);
  const [selectedFriends, setSelectedFriends] = useState(initialSelectedFriends);
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
        title: formTitle,
        personal_experience_info: personalExperience || '', // Ensure personalExperience is not undefined
        user: authUserState.user.id,
        friends: selectedFriends
      };
  

      // Log the locationData payload just before sending it to updateLocation
      console.log('Location Data to be sent:', id, locationData);

      const res = await updateLocation(id, locationData); // Use the updateLocation function from the api file
      onLocationUpdate(res);

      setLocationList(locationList.map(loc => loc.id === id ? res : loc)); // Update the location in the list
      console.log('Location updated in location list:', res);
      
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}> 
      {showSaveMessage && <Text style={styles.saveMessage}>Location updated successfully!</Text>}
      <Text style={styles.address}>{address}</Text>

      <TextInput
        style={styles.input}
        value={formTitle}
        onChangeText={setFormTitle}
        placeholder='Title'
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
      <Button title='Update Location' onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    marginBottom: 26,
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
    textAlignVertical: 'top', 
  },
  friendCheckboxesContainer: {
    marginBottom: 10,
  },
});

export default FormLocationUpdate;
