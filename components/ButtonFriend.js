import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFriendList } from '../context/FriendListContext'; // Import useFriendList hook


const ButtonFriend = ({ friendId, onPress }) => {
  const { friendList } = useFriendList();
  //console.log("ButtonFriend friendId: ", friendId);
 
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
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ButtonFriend;
