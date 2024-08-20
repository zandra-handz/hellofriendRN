import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationTwoSectionsSvg from '../components/ButtonLottieAnimationTwoSectionsSvg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import MeetingWithAFriendOutlineSvg from '../assets/svgs/meeting-with-a-friend-outline.svg';
import AlertPanelBottom from './AlertPanelBottom';
import { useNavigation } from '@react-navigation/native';
import PersonalConnectionsSvg from '../assets/svgs/personal-connections.svg';


const ActionFriendPageHeader = ({ 
  onPress,
  buttonHeight=140,
  headerRadius=30, 
  headerTopRadius=0,
  svgColor='white',
  Deselector=false }) => {

  const navigation = useNavigation();

  const { selectedFriend, friendDashboardData, friendColorTheme, loadingNewFriend, setFriend } = useSelectedFriend();
  
  const [showProfile, setShowProfile] = useState(false);
  const [showNextHello, setShowNextHello] = useState(true);
  const [lightColor, setLightColor] = useState('black');
  const [darkColor, setDarkColor] = useState('black');

  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if(friendColorTheme.invertGradient) {
        setLightColor(friendColorTheme.darkColor || 'gray');
        setDarkColor(friendColorTheme.lightColor || 'white');
      } else {
        setLightColor(friendColorTheme.lightColor || 'white');
        setDarkColor(friendColorTheme.darkColor || 'gray');
      };
    }
    if (friendColorTheme && friendColorTheme.useFriendColorTheme == false) {
      setLightColor('white');
      setDarkColor('gray');
    }
  }, [friendColorTheme]);


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
      {friendDashboardData && (
      <Animated.View style={{ flex: 1 }}>
        <ButtonLottieAnimationTwoSectionsSvg
          onPress={handlePress}
          buttonHeight={Deselector ? 140 : buttonHeight}
          borderRadius={headerRadius}
          borderTopRadius={Deselector ? 30 : headerTopRadius}
          headerText={Deselector ? 'SELECTED' : selectedFriend ? selectedFriend.name : ''}
          navigateToFirstPage={false}
          label='Say hello on '
          labeltwo={friendDashboardData ? `${friendDashboardData[0].future_date_in_words}` : ' '}
          //moved 'say hello' from additionalText to label
          fontMargin={3}
          animationSource={require('../assets/anims/heartinglobe.json')}
          rightSideAnimation={false}
          labelColor="white"
          labelFontSize={17}
          animationWidth={234}
          animationHeight={234} 
          labelContainerMarginHorizontal={4}
          animationMargin={-64}
          shapePosition="right"
          showGradient={true}
          lightColor={Deselector ? 'black' : lightColor}
          darkColor={Deselector ? 'black' : darkColor}
          SourceSvg={MeetingWithAFriendOutlineSvg}
          svgColor={darkColor}
          shapeWidth={190}
          shapeHeight={190}
          showShape={false} 
          shapePositionValue={-214}
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
       )}
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
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },   
});

export default ActionFriendPageHeader;
