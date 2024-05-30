import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import AlertPanelBottom from './AlertPanelBottom'; // Import the AlertProfile component

const DynTextFriend = ({ maxWidth }) => {
  const { selectedFriend } = useSelectedFriend();
  const [showPopup, setShowPopup] = useState(false); // State to toggle the visibility of the popup

  // If no friend is selected, return null
  if (!selectedFriend) {
    return null;
  }

  return (
    <View>
      {/* Wrap the text with TouchableOpacity to make it a button */}
      <TouchableOpacity onPress={() => setShowPopup(true)}>
        {/* Add a container with maxWidth to ensure the text doesn't wrap */}
        <View style={[styles.container, { maxWidth: maxWidth }]}>
          <Text style={styles.text}>
            {selectedFriend.name}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Render the popup based on showPopup state */}
      <AlertPanelBottom
        visible={showPopup}
        profileData={selectedFriend} // Pass the selectedFriend data to the AlertProfile component
        onClose={() => setShowPopup(false)} // Close the popup when Close button is pressed
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%', // Ensure the container takes up full width
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
},
  text: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 24,
    overflow: 'hidden',
  },
});

export default DynTextFriend;
