import React from 'react';
import { Button, Image, View, StyleSheet, Dimensions } from 'react-native';
import {useColorScheme} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HelloFriendHeader = ({ handleSignOutPress, additionalElements }) => {
  const colorScheme = useColorScheme();

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
      
      {/* Container for the image in the center */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.croppedImage}
          source={require('../img/lizard-14.jpg')}
          resizeMode="contain" // or any other appropriate resizeMode
        />
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
  imageContainer: {
    flex: 1, // Equal width to other containers
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1, // Equal width to other containers
    alignItems: 'flex-end', // Align the icon to the right within the container
  },
  croppedImage: {
    width: 100, // Set the width of the image
    height: 100, // Set the height of the image
    resizeMode: 'contain', // or any other appropriate resizeMode
  },
  additionalElement: {
    marginRight: 10,  
  },
});
