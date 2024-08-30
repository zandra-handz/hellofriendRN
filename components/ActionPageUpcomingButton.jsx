import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import ButtonMultiFeatureUpcoming from './ButtonMultiFeatureUpcoming';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import ActionFriendPageHeader from './ActionFriendPageHeader';
import ButtonArrowSvgAndLabel from '../components/ButtonArrowSvgAndLabel';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ActionPageUpcomingButton = ({ onPress }) => {
  const { authUserState, userAppSettings } = useAuthUser();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
 
  
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
  const opacityAnim = new Animated.Value(1);


  useEffect(() => {
    setShowSecondButton(false);

  }, [selectedFriend]);

  const navigateToFirstPage = () => {
    setShowSecondButton(false);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    setShowSecondButton(true);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (hello) => {
    const { id, name } = hello.friend; 
    const selectedFriend = id === null ? null : { id: id, name: name }; 
    setFriend(selectedFriend);  
  };

  return (
    <>
 
    <View style={styles.container}>

      {!selectedFriend && (
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonMultiFeatureUpcoming
            onPress={() => handlePress(mainHello)}
            isLoading={isLoading} 
            navigateToFirstPage={navigateToFirstPage}
            headerText={mainHello ? 'UP NEXT' : ''}
            label={mainHello ? mainHello.friend.name : `Hi ${authUserState.user.username}!`}
            additionalText={mainHello ? mainHello.future_date_in_words : ''}
            
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={30}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            darkColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
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
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
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

      {selectedFriend &&(
        <ActionFriendPageHeader Deselector={true} />
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
    height: 140,
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }, 
});

export default ActionPageUpcomingButton;
