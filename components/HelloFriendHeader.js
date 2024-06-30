import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import DynTextFriend from './DynTextFriend';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import DynImageUser from './DynImageUser';
import CardStatusVertical from './CardStatusVertical';

const HelloFriendHeader = ({ additionalElements }) => {
  const { selectedFriend } = useSelectedFriend();
  const navigation = useNavigation(); // Get the navigation object

  const navigateToDefaultActionMode = () => {
    navigation.navigate('hellofriend'); // Navigate to the Intermediate screen
  };

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

      <View style={styles.statusContainer}>
        <CardStatusVertical showFooter={false} /> 
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
  statusContainer: {  
    alignItems: 'center', 
    justifyContent: 'center',
    width: '50%', 
    height: '100%',
    
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
  additionalElement: {},
});

export default HelloFriendHeader;
