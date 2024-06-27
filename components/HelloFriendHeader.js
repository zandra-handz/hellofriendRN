import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DynTextFriend from './DynTextFriend';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import DynImageUser from './DynImageUser';

const HelloFriendHeader = ({ handleSignOutPress, additionalElements }) => {
  const { selectedFriend } = useSelectedFriend();

  return (
    <View style={styles.container}>
      <View style={styles.additionalElementsContainer}>
        {additionalElements.map((element, index) => (
          <View key={index} style={styles.additionalElement}>{element}</View>
        ))}
      </View>

      <View style={styles.dynamicContentContainer}>
        <DynTextFriend maxWidth={500} />
        {!selectedFriend && <DynImageUser />}
      </View>

      <View style={styles.iconContainer}>
        {/* Adjust icon alignment */}
        <FontAwesome name="gear" size={28} color="black" onPress={handleSignOutPress} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 130, // Fixed height for the header
    paddingHorizontal: 8,
    paddingTop: 42,
    
  },
  additionalElementsContainer: {
    flexDirection: 'row',
  },
  dynamicContentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 10, // Ensure alignment with NextHello component
  },
  iconContainer: {
    alignItems: 'flex-start', // Align icon to the top
  },
  icon: {
    padding: 0,
    marginRight: 4, // Adjust as needed for precise positioning
    marginTop: -10,
  },
  additionalElement: {
  },
});

export default HelloFriendHeader;
