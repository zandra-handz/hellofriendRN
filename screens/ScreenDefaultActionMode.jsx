import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalGen from '../components/ModalGen';
import FriendSelect from '../data/FriendSelect';

import QuickAddHello from '../speeddial/QuickAddHello';
import QuickAddImage from '../speeddial/QuickAddImage';
import QuickAddThought from '../speeddial/QuickAddThought';
import { useAuthUser } from '../context/AuthUserContext';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';

import ActionScreenButtonAddMoment from '../components/ActionScreenButtonAddMoment';
import ActionScreenButtonAddImage from '../components/ActionScreenButtonAddImage';
import ActionScreenButtonAddHello from '../components/ActionScreenButtonAddHello';
import ActionScreenButtonAddFriend from '../components/ActionScreenButtonAddFriend';
import ActionScreenButtonAddLocation from '../components/ActionScreenButtonAddLocation';


import ButtonLottieAnimationSatellites from '../components/ButtonLottieAnimationSatellites'; // Make sure to import the correct component
import ActionPageSettings from '../components/ActionPageSettings';
import ActionPageUpcomingButton from '../components/ActionPageUpcomingButton'; // Import the new component
import ActionFriendPageLocations from '../components/ActionFriendPageLocations'; // Import the new component
import HelloFriendFooter from '../components/HelloFriendFooter';
import { Ionicons } from '@expo/vector-icons';

const ScreenDefaultActionMode = ({ navigation, mainAppButton=false }) => {
  
  const { themeStyles } = useGlobalStyle(); 

  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);

  const openModal1 = () => setModal1Visible(true);
  const openModal2 = () => setModal2Visible(true);
  const openModal3 = () => setModal3Visible(true);
  const openModalSettings = () => setModalSettingsVisible(true);


  const navigateToAddMomentScreen = () => {
    navigation.navigate('AddMoment');
  };

  const navigateToAddImageScreen = () => {
    navigation.navigate('AddImage');
  };

  const navigateToAddHelloScreen = () => {
    navigation.navigate('AddHello');
  };

  const navigateToAddFriendScreen = () => {
    navigation.navigate('AddFriend');
  };

  const navigateToAddLocationScreen = () => {
    navigation.navigate('LocationSearch');
};

  const navigateSignInScreen = () => {
    navigation.navigate('Signin');
  };

return ( 
  <View style={[styles.container, themeStyles.container]}>
    {authUserState.authenticated && authUserState.user ? (
      <>
        {isLoading ? (
          <View style={styles.loadingTextContainer}>
            <Text style={styles.loadingTextBold}>
              Welcome back, {authUserState.user.username}!
            </Text>
          </View>
        ) : (
          <>
            {mainAppButton && (
              <TouchableOpacity 
                style={styles.navigationButton} 
                onPress={() => navigation.navigate('Home')}
              >
                <Ionicons name="calendar" size={24} color="white" />
                <Text style={styles.navigationButtonText}>main app</Text>
              </TouchableOpacity>
            )}

            <View style={styles.buttonContainer}>
              <View style={{height: 146, width: '100%'}}>   
                <ActionPageUpcomingButton/>
              </View>
              <View style={{height: 140, width: '100%'}}>  
                <ActionScreenButtonAddMoment onPress={navigateToAddMomentScreen}/>
              </View>
              <View style={{height: 140, width: '100%'}}> 
                <ActionScreenButtonAddImage onPress={navigateToAddImageScreen }/>
              </View>
              <View style={{height: 140, width: '100%'}}> 
                <ActionScreenButtonAddHello onPress={navigateToAddHelloScreen}/>
              </View>
              {selectedFriend && (
              <View style={{height: 140, width: '100%'}}> 
                <ActionScreenButtonAddLocation onPress={navigateToAddLocationScreen} />
              </View>
               )}
              {!selectedFriend && (
              <View style={{height: 140, width: '100%'}}> 
                <ActionScreenButtonAddFriend onPress={navigateToAddFriendScreen} />
              </View>
               )}

            </View>
            <View style={styles.footerContainer}>  
            <HelloFriendFooter />
            </View>
          </>
        )}
      </>
    ) : (
      <View style={styles.signInContainer}>
        <Text style={styles.signInPrompt}>Please sign in to continue.</Text>
        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={navigateSignInScreen}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
    backgroundColor: 'black',
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
    height: '90.5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingBottom: 0, 
    paddingTop: 0,
  },
  footerContainer: {
    position: 'absolute',
    width: '100%', 
    bottom: 0,

  },
});

export default ScreenDefaultActionMode;
