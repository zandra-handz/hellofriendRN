import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFriendList } from '../context/FriendListContext'; // Import useFriendList hook


const ButtonFriend = ({ friendId, onPress }) => {
  const { friendList } = useFriendList();
  console.log("ButtonFriend friendId: ", friendId);
 
  const friend = friendList.find(friend => friend.id === friendId);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{friend ? friend.name : 'Unknown Friend'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
});

export default ButtonFriend;
