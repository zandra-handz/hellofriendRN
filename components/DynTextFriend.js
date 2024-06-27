import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import AlertPanelBottom from './AlertPanelBottom';
import CardStatusHeader from './CardStatusHeader';

const DynTextFriend = ({ maxWidth }) => {
  const { selectedFriend } = useSelectedFriend();
  const [showPopup, setShowPopup] = useState(false);

  if (!selectedFriend) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPopup(true)} style={styles.touchable}>
        <Text style={styles.text}>
          {selectedFriend.name}
        </Text>
      </TouchableOpacity>

      {/* Ensure CardStatusHeader starts on a new line */}
      <View style={styles.statusContainer}>
        <CardStatusHeader showFooter={false} />
      </View>

      <AlertPanelBottom
        visible={showPopup}
        profileData={selectedFriend}
        onClose={() => setShowPopup(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Ensure items are stacked vertically
    paddingHorizontal: 2,
    paddingVertical: 10,
    
  },
  touchable: {
    width: '100%', // Take up full width
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 24, 
    overflow: 'hidden',
  },
  statusContainer: {
    width: '100&',
    alignItems: 'left',
    alignContent: 'left',
    
  },
});

export default DynTextFriend;
