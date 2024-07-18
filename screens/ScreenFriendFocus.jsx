import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import ModalGen from '../components/ModalGen';
import FriendSelect from '../data/FriendSelect';
import QuickAddHello from '../speeddial/QuickAddHello';
import QuickAddImage from '../speeddial/QuickAddImage';
import QuickAddThought from '../speeddial/QuickAddThought';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import ButtonLottieAnimationSatellites from '../components/ButtonLottieAnimationSatellites'; // Make sure to import the correct component
import ActionPageSettings from '../components/ActionPageSettings';
import ActionPageUpcomingButton from '../components/ActionPageUpcomingButton'; // Import the new component
import ActionFriendPageHeader from '../components/ActionFriendPageHeader'; // Import the new component
import ActionFriendPageMoments from '../components/ActionFriendPageMoments'; // Import the new component
import ActionFriendPageImages from '../components/ActionFriendPageImages'; // Import the new component
import ActionFriendPageHelloes from '../components/ActionFriendPageHelloes'; // Import the new component
import ActionFriendPageLocations from '../components/ActionFriendPageLocations'; // Import the new component


import HelloFriendFooter from '../components/HelloFriendFooter';
import { Ionicons } from '@expo/vector-icons';

const ScreenFriendFocus = () => {
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  return (
    <View style={styles.container}>
      {loadingNewFriend && (
        <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingTextBold}>Loading data for {selectedFriend.name}!</Text>
        </View>
      )}
      {!loadingNewFriend && (
            <View style={styles.buttonContainer}>
            
            <ActionFriendPageHeader />
            <ActionFriendPageLocations />
            <ActionFriendPageMoments /> 
            <ActionFriendPageImages /> 
            <ActionFriendPageHelloes />
            
            </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  }, 
  loadingTextContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingBottom: 6, 
    paddingTop: 0,
  },
  loadingText: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',

  },
  loadingTextBold: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',

  },
  navigationButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    paddingBottom: 6, 
    paddingTop: 0,
  },

});
export default ScreenFriendFocus;