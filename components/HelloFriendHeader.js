import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DynTextFriend from './DynTextFriend'; // Import DynTextFriend component
import { useSelectedFriend } from '../context/SelectedFriendContext';
import DynImageUser from './DynImageUser'; // Import DynImageUser component

const { width, height } = Dimensions.get('window');

const HelloFriendHeader = ({ handleSignOutPress, additionalElements }) => {
  const colorScheme = useColorScheme();
  const { selectedFriend, friendState } = useSelectedFriend();

  return (
    <View style={[styles.container,
      colorScheme === 'light'
        ? { backgroundColor: '#fff' }
        : { backgroundColor: '#fff' },
    ]}>
      {/* Container for additional elements on the left */}
      <View style={styles.additionalElementsContainer}>
        {additionalElements.map((element, index) => (
          <View key={index} style={styles.additionalElement}>{element}</View>
        ))}
      </View>

      {/* Container for the dynamic text or image */}
      <View style={styles.dynamicContentContainer}>
        <DynTextFriend maxWidth={500}/>
        {/* Render the DynImageUser component */}
        {!selectedFriend && <DynImageUser />}
      </View>

      {/* Container for the gear icon on the right */}
      <View style={styles.iconContainer}>
        <FontAwesome name="gear" size={28} paddingBottom={18} color="black" onPress={handleSignOutPress} />
      </View>
    </View>
  );
};

export default HelloFriendHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingTop: 32,
  },
  additionalElementsContainer: {
    flex: 1, // Equal width to other containers
    flexDirection: 'row',
    alignItems: 'center',
  },
  dynamicContentContainer: {
    flex: 1, // Equal width to other containers
    width: 200,
    height: 100, // this to match the image
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1, // Equal width to other containers
    alignItems: 'flex-end', // Align the icon to the right within the container
  },
  additionalElement: {
    marginRight: 10,
  },
});
