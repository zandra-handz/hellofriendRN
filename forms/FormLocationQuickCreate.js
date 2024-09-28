import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PickerParkingType from '../components/PickerParkingType';

import { createLocation, fetchParkingChoices } from '../api';
import { useAuthUser } from '../context/AuthUserContext';
import { useLocationList } from '../context/LocationListContext';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const FormLocationQuickCreate = forwardRef((props, ref) => {
  const { title, address, onMakingCallChange } = props; 
  const { authUserState } = useAuthUser();
  const { friendList } = useFriendList();
  const { locationList, setLocationList } = useLocationList();
  const { themeStyles } = useGlobalStyle();
  const [parkingType, setParkingType] = useState(null);
  const [parkingTypeText, setParkingTypeText] = useState(null);
  const [typeChoices, setTypeChoices] = useState(['location has free parking lot', 
    'free parking lot nearby', 
    'street parking', 
    'fairly stressful or unreliable street parking',
    'no parking whatsoever',
    'unspecified']);
  const [personalExperience, setPersonalExperience] = useState('');
  const [customTitle, setCustomTitle] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isMakingCall, setIsMakingCall] = useState(false); 

  const showInHouseSaveButton = false;


  useEffect(() => {
    response = fetchParkingChoices();

  }, []);

  useEffect(() => {
    if (onMakingCallChange) {
      onMakingCallChange(isMakingCall);
    }
  }, [isMakingCall, onMakingCallChange]);

  // Expose the handleSubmit function via ref
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

 
  
  const onParkingTypeChange = (index) => {
    
    setParkingType(index); 
    setParkingTypeText(`${typeChoices[index]}`); 
    console.log(`Parking type selected: ${typeChoices[index]}`);
 
    console.log(index);
  };

  useEffect(() => {
    console.log(parkingType); 
  }, [parkingType]);

  const handleFriendSelect = (friendId) => {
    const updatedFriends = selectedFriends.includes(friendId)
      ? selectedFriends.filter(id => id !== friendId)
      : [...selectedFriends, friendId];
    setSelectedFriends(updatedFriends);
  };

  const handleSubmit = async () => {
    setIsMakingCall(true); 
    const trimmedCustomTitle = customTitle?.trim() || null;

    try {
      const locationData = {
        friends: selectedFriends.map(id => Number(id)),
        title: title,
        address: address,
        parking_score: parkingTypeText,
        custom_title: trimmedCustomTitle,
        personal_experience_info: personalExperience,
        user: authUserState.user.id, 
      };
      
      console.log('Creating location with payload:', locationData);
      
      const res = await createLocation(locationData);
      console.log('Created location:', res);
      
      setLocationList(prevList => [res, ...prevList]); 
      
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
      setIsMakingCall(false); 
    } catch (error) {
      console.error('Error creating location:', error);
      setIsMakingCall(false); 
    }
  };

  return (
    <View style={[styles.container, themeStyles.genericTextBackground]}> 
      {showSaveMessage && <Text style={styles.saveMessage}>Location saved successfully!</Text>}
      <Text style={[styles.title, themeStyles.subHeaderText]}>{title}</Text>
      <Text style={[styles.address, themeStyles.genericText]}>{address}</Text>

      <TextInput
        style={[styles.input, themeStyles.input]}
        value={customTitle}
        onChangeText={setCustomTitle}
        placeholder='Optional custom title' 
        placeholderTextColor='darkgray'
      />

      <PickerParkingType 
        containerText=''
        selectedTypeChoice={parkingType}
        onTypeChoiceChange={onParkingTypeChange}
      />

      <TextInput
        style={[themeStyles.input, styles.textArea]}
        value={personalExperience}
        onChangeText={setPersonalExperience}
        placeholder='Optional notes'
        placeholderTextColor='darkgray'
        multiline
        numberOfLines={4}
      />

      <View style={styles.friendCheckboxesContainer}>
        <FlatList
          data={friendList}
          keyExtractor={(item) => item.id.toString()} // Ensure each key is unique
          renderItem={({ item }) => (
            <CheckBox
              title={item.name}
              checked={selectedFriends.includes(item.id)}
              onPress={() => handleFriendSelect(item.id)}
            />
          )}
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {showInHouseSaveButton && ( 
        <Button title='Create Location' onPress={handleSubmit} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 0, 
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18, 
    fontFamily: 'Poppins-Bold', 
  },
  address: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
  },
  saveMessage: {
    color: 'green',
    marginBottom: 10,
  },
  input: {
    height: 'auto',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10, 
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20, 
  },
  friendCheckboxesContainer: {
    height: 200,  
  },
  flatList: { 
  },
});

export default FormLocationQuickCreate;
