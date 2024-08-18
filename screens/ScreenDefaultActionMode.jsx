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

  return (
    <View style={[styles.container, themeStyles.container]}>
      {isLoading && (
        <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingTextBold}>Welcome back, {authUserState.user.username}!</Text>
        </View>

      )}
      {!isLoading &&(
      <>
      <ModalGen
        modalVisible={modal1Visible}
        setModalVisible={setModal1Visible}
        headerTitle={selectedFriend ? `Add hello for ${selectedFriend.name}` : 'Add hello'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => setModal1Visible(false) }
        ]}
      >
        <QuickAddHello onClose={() => setModal1Visible(false)} />
      </ModalGen>
      <ModalGen
        modalVisible={modal2Visible}
        setModalVisible={setModal2Visible}
        headerTitle={selectedFriend ? `Add image for ${selectedFriend.name}` : 'Add image'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => setModal2Visible(false) }
        ]}
      >
        <QuickAddImage onClose={() => setModal2Visible(false)} />
      </ModalGen>
      <ModalGen
        modalVisible={modal3Visible}
        setModalVisible={setModal3Visible}
        headerTitle={selectedFriend ? `Add moment to give ${selectedFriend.name}` : 'Add moment'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => setModal3Visible(false) }
        ]}
      >
        <QuickAddThought onClose={() => setModal3Visible(false)} />
      </ModalGen>

      <ModalGen
        modalVisible={modalSettingsVisible}
        setModalVisible={setModalSettingsVisible}
        headerTitle="Settings"
        buttons={[
          { text: 'Close', onPress: () => setModalSettingsVisible(false) }
        ]}
      >
        <ActionPageSettings />
      </ModalGen>
      {mainAppButton && (
      <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="calendar" size={24} color="white" />
        <Text style={styles.navigationButtonText}>main app</Text>
      </TouchableOpacity>
      )}

      <View style={styles.buttonContainer}>
        <ActionPageUpcomingButton/>
        {selectedFriend &&(
          <ActionFriendPageLocations topIconSize={28} bottomIconSize={28} buttonHeight={80} buttonRadius={30} headerHeight={30} includeHeader={false} headerInside={false} headerText={'LOCATIONS'} />
            
        )}
        <ActionScreenButtonAddMoment onPress={navigateToAddMomentScreen}/>
        <ActionScreenButtonAddImage onPress={navigateToAddImageScreen }/>
        <ActionScreenButtonAddHello onPress={navigateToAddHelloScreen}/>

        {!selectedFriend && (
          <ActionScreenButtonAddFriend onPress={navigateToAddFriendScreen} />
        )}
      </View>
      <HelloFriendFooter />
    </>
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
    height: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingBottom: 6, 
    paddingTop: 0,
  },
});

export default ScreenDefaultActionMode;
