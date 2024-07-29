import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationTwoSections from './ButtonLottieAnimationTwoSections';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import AlertPanelBottom from './AlertPanelBottom';
import { useNavigation } from '@react-navigation/native';


const ActionFriendPageHeader = ({ onPress, Deselector = false }) => {

  const navigation = useNavigation();

  const { selectedFriend, friendDashboardData, loadingNewFriend, setFriend } = useSelectedFriend();
  const [showProfile, setShowProfile] = useState(false);
  const [showNextHello, setShowNextHello] = useState(true);

  // Function to handle resetting the selected friend
  const handleDeselect = () => {
    if (Deselector) {
      setFriend(null);
    }
  };

  const navigateBackToFriendFocus = () => {
    navigation.navigate('FriendFocus');
  };

    // Function to handle button press based on Deselector
    const handlePress = () => {
      if (Deselector) {
        navigateBackToFriendFocus();
      } else {
        setShowProfile(true);
      }
    };

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1 }}>
        <ButtonLottieAnimationTwoSections
          onPress={handlePress}
          headerText={selectedFriend ? selectedFriend.name : ''}
          navigateToFirstPage={false}
          label={friendDashboardData ? `days since last hello: ${friendDashboardData[0].days_since}` : ''}
          additionalText={friendDashboardData ? `say hello on ${friendDashboardData[0].future_date_in_words}` : ' '}
          fontMargin={3}
          animationSource={require('../assets/anims/heartinglobe.json')}
          rightSideAnimation={false}
          labelColor="white"
          animationWidth={234}
          animationHeight={234}
          lightColor="black"
          labelContainerMarginHorizontal={4}
          animationMargin={-64}
          shapePosition="right"
          shapeSource={require('../assets/shapes/beer.png')}
          shapeWidth={340}
          shapeHeight={340}
          shapePositionValue={-154}
          showIcon={false}
          satellites={Deselector} // Toggle satellite section based on Deselector
          satelliteSectionPosition="right"
          satelliteCount={Deselector ? 2 : 0} // Show two satellites if Deselector is true
          satelliteHellos={Deselector ? [{ label: 'Deselect', onPress: handleDeselect }] : []} // Satellite button to reset the selected friend
          satellitesOrientation="vertical" // Adjust orientation if needed
          satelliteHeight="20%" // Adjust height if needed
          satelliteOnPress={handleDeselect} 
        />
      </Animated.View>
      <AlertPanelBottom
        visible={showProfile}
        profileData={selectedFriend}
        onClose={() => setShowProfile(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 10,
    marginRight: 10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  arrowTextWhite: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ActionFriendPageHeader;
