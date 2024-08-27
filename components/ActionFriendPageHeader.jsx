import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated  } from 'react-native';
import ButtonLottieAnimationTwoSectionsSvg from '../components/ButtonLottieAnimationTwoSectionsSvg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import MeetingWithAFriendOutlineSvg from '../assets/svgs/meeting-with-a-friend-outline.svg';
import AlertPanelBottom from './AlertPanelBottom';
import { useNavigation } from '@react-navigation/native';
import LoadingPage from '../components/LoadingPage';
import ButtonArrowSvgAndLabel from '../components/ButtonArrowSvgAndLabel';

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
      {loadingNewFriend && (
      <View style={styles.loadingContainer}>

        <LoadingPage 
          loading={loadingNewFriend}
          spinnerSize={70}
        />
      </View>
    )}
      {Deselector && !loadingNewFriend && friendDashboardData && (
        
        <ButtonArrowSvgAndLabel 
          direction='profile'
          screenSide='left'
          label='view'
          onPress={navigateBackToFriendFocus}
          /> 
      )}
      {friendDashboardData && (
      <Animated.View style={{ flex: 1 }}>
        <ButtonLottieAnimationTwoSectionsSvg
          onPress={handlePress}
          buttonHeight={Deselector ? 140 : buttonHeight}
          borderRadius={headerRadius}
          borderTopRadius={Deselector ? 30 : headerTopRadius}
          preLabelFontSize={Deselector ? 18 : 28}
          mainButtonWidth={Deselector ? '84%' : '77%'}
          headerText={Deselector ? 'SELECTED' : selectedFriend ? selectedFriend.name : ''}
          navigateToFirstPage={false} 
          labelColor="white"
          labelFontSize={Deselector? 30 : 17}
          label={Deselector? selectedFriend ? selectedFriend.name : '' : 'Say hello on '}
          additionalTextSize={16}
          additionalText={friendDashboardData ? `${friendDashboardData[0].future_date_in_words}` : ' '}
          showLabelTwo={false}
          fontMargin={3}
          animationSource={require('../assets/anims/heartinglobe.json')}
          rightSideAnimation={false} 
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
          showShape={Deselector? false : true} 
          shapePositionValue={-214}
          showIcon={false}
          satellites={Deselector} // Toggle satellite section based on Deselector
          satelliteSectionPosition="right"
          satelliteSectionWidth={Deselector ? '28%' : '33.33%'}
          satelliteSectionMarginLeft={Deselector ? -22 : -20}
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
  loadingContainer: {
    width: '100%',
    height: 140,
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }, 
});

export default ActionFriendPageHeader;
