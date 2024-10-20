import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import ButtonMultiFeatureUpcoming from './ButtonMultiFeatureUpcoming';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useNavigation } from '@react-navigation/native';

import ActionFriendPageHeader from './ActionFriendPageHeader';
import ButtonArrowSvgAndLabel from '../components/ButtonArrowSvgAndLabel';


import LizardSvg from '../assets/svgs/lizard';
 
const ActionPageUpcomingButton = ({height=140}) => {
  const { authUserState, userAppSettings } = useAuthUser();
  
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend, loadingNewFriend } = useSelectedFriend(); 
  const [ showActionFriendPageHeader, setShowActionFriendPageHeader] = useState(true);
 
  
  let mainHello = null;
  let satelliteHellos = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalHellos = [];

  if (!isLoading && upcomingHelloes.length > 0) {
    mainHello = upcomingHelloes[0];
    if ( userAppSettings && userAppSettings.simplify_app_for_focus) {
      satelliteHellos = upcomingHelloes.slice(0,1);
    } else {
      satelliteHellos = upcomingHelloes.slice(0);
    };
    
    additionalSatelliteCount = satelliteHellos.length - satellitesFirstPage;

    if (additionalSatelliteCount > 0) {
      additionalHellos = upcomingHelloes.slice(satellitesFirstPage);
    } else {
      additionalHellos = null;
    }
  }

  const [showSecondButton, setShowSecondButton] = useState(false);
  const navigation = useNavigation();
  const opacityAnim = new Animated.Value(1);


  useEffect(() => {
    setShowSecondButton(false);
    if (selectedFriend) {
      setShowActionFriendPageHeader(true);

    };

  }, [selectedFriend]);

  const navigateToFirstPage = () => {
    setShowActionFriendPageHeader(true);
    setShowSecondButton(false); 
  };

  const handleNext = () => {
    setShowSecondButton(true); 
    setShowActionFriendPageHeader(false);
  };

  const handleDeselect = () => {
    setFriend(null);


  };
 

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
    //navigateToFriendFocus();
    console.log('here is where I was navigating to friend focus screen from main');
    }

  }, [loadingNewFriend]);

  const handlePress = (hello) => {
    const { id, name } = hello.friend; 
    const selectedFriend = id === null ? null : { id: id, name: name }; 
    setFriend(selectedFriend);  

  };

  

  return (
    <>
 
    <View style={[styles.container, {height: height}]}>

    {(!selectedFriend || (selectedFriend && !showActionFriendPageHeader)) && (

      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonMultiFeatureUpcoming
            height={height}
            onPress={() => handlePress(mainHello)}
            isLoading={isLoading} 
            navigateToFirstPage={navigateToFirstPage}
            headerText={mainHello ? 'UP NEXT' : ''}
            label={mainHello ? mainHello.friend.name : `Hi ${authUserState.user.username}!`}
            
            additionalText={mainHello ? mainHello.future_date_in_words : ''}
            labelFontSize={30}
            labelColor="white"
            lightColor="black"
            darkColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={<LizardSvg width={150} height={150} color="white"/>}
            
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154} 
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteHellos}
            satellitesOrientation="vertical"
            satelliteHeight="100%"
            additionalPages={showSecondButton}
            additionalSatellites={additionalHellos}
            satelliteOnPress={(friend) => handlePress(friend)} 
          />
        ) : (
          <ButtonMultiFeatureUpcoming
            height={height}
            onPress={() => handlePress(mainHello)}
            navigateToFirstPage={navigateToFirstPage}
            headerText={mainHello ? 'UP NEXT' : ''}
            label={mainHello ? mainHello.friend_name : `Hi ${authUserState.user.username}!`}
            fontMargin={3}
            additionalText={mainHello ? mainHello.future_date_in_words : ''}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={30}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={<LizardSvg width={150} height={150} color="white"/>}
            
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteHellos}
            satellitesOrientation="vertical"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(friend) => handlePress(friend)} 
          /> 
        )}
      </Animated.View>
      )} 

      {selectedFriend && showActionFriendPageHeader && (
        <ActionFriendPageHeader Deselector={true} handleNext={handleNext} handleDeselect={handleDeselect} />
      )}

      {!showSecondButton && additionalSatelliteCount > 0 && (
        
        <ButtonArrowSvgAndLabel 
        direction='right'
        screenSide='right'
        label='more'
        onPress={handleNext}
        /> 
      )}

      {showSecondButton && (
        <ButtonArrowSvgAndLabel 
        direction='left'
        screenSide='right'
        label='back'
        onPress={navigateToFirstPage}
        /> 
      )}
    </View> 
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }, 
});

export default ActionPageUpcomingButton;
