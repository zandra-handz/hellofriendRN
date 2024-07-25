import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationTwoSections from './ButtonLottieAnimationTwoSections';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import DaysSince from '../data/FriendDaysSince'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import AlertPanelBottom from './AlertPanelBottom';



const ActionFriendPageHeader = ({ onPress }) => {
    const { selectedFriend, friendDashboardData, loadingNewFriend } = useSelectedFriend();
    const [showProfile, setShowProfile] = useState(false);
    const [showNextHello, setShowNextHello] = useState(true);

    let daysSinceInHeader = false;

    const handleOnPress = () => {
        console.log("ActionFriendPageHeader clicked!");
    };
 
    

  
  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1 }}>
          <ButtonLottieAnimationTwoSections
            onPress={() => setShowProfile(true)}
            headerText={selectedFriend.name}
            
            navigateToFirstPage={false}
            label={friendDashboardData ? `days since last hello: ${friendDashboardData[0].days_since}`: ''}
            additionalText={friendDashboardData ? `say hello on ${friendDashboardData[0].future_date_in_words}`: ' '}
            
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
            satellites={false}
            additionalPages={false} 
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
    overflow: 'hidden', // Ensure inner elements respect the rounded border
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
