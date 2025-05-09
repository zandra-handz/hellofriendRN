import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { updateLocation } from '../api';  
import { useAuthUser } from '../context/AuthUserContext';
import useLocationFunctions from '../hooks/useLocationFunctions';
import { useFriendList } from '../context/FriendListContext';

const FormLocationUpdate = ({ onLocationUpdate, location }) => {
  const { authUserState } = useAuthUser();
  const { friendList } = useFriendList();
  const { locationList, setLocationList } = useLocationFunctions();

  const { id, title: initialTitle, address, friends } = location;

  useEffect(() => {
    console.log('Friends prop:', friends); 

    const initialSelectedFriends = Array.isArray(friends) ? friends.map(friend => friend.id) : [];
    setSelectedFriends(initialSelectedFriends);
  }, [friends]);
 
  const [personalExperience, setPersonalExperience] = useState(location.personal_experience_info);
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
            personal_experience_info: personalExperience || '',
            user: authUserState.user.id,
        };

        console.log('Location Data to be sent:', id, locationData);

        const res = await updateLocation(id, locationData);
        onLocationUpdate(res);
 
        const updatedLocationList = locationList.map(loc => loc.id === id ? {
            ...loc,
            friends: res.friends.map(friendId => ({
                id: friendId,
                name: friendId  
            })),
        } : loc);
        setLocationList(updatedLocationList);

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

      <Text style={styles.address}>{initialTitle}</Text>


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
