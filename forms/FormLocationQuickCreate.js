import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { createLocation } from '../api';
import { useAuthUser } from '../context/AuthUserContext';
import { useLocationList } from '../context/LocationListContext';
import { useFriendList } from '../context/FriendListContext';

const FormLocationQuickCreate = ({ onLocationCreate, title, address }) => {
  const { authUserState } = useAuthUser();
  const { friendList } = useFriendList();
  const { locationList, setLocationList, selectedLocation, setSelectedLocation } = useLocationList();

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
        friends: selectedFriends.map(id => Number(id)),
        title: title,
        address: address,
        personal_experience_info: personalExperience,
        user: authUserState.user.id, 
      };
      
      console.log('Creating location with payload:', locationData);
      
      const res = await createLocation(locationData);
      console.log('Created location:', res);
      
      setLocationList(prevList => [res, ...prevList]); // Update locationList with the new location

      // Set selectedLocation after updating locationList
      // rsetSelectedLocation(res);
      
      onLocationCreate(res);

      console.log('Location added to location list:', res);

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  // Log selectedLocation changes
  useEffect(() => {
    console.log('Selected Location changed:', selectedLocation);
  }, [selectedLocation]);

  return (
    <ScrollView contentContainerStyle={styles.container}> 
      {showSaveMessage && <Text style={styles.saveMessage}>Location saved successfully!</Text>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{address}</Text>

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
    padding: 10,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
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

export default FormLocationQuickCreate;
