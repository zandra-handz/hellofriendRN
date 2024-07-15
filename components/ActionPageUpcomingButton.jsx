import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import ButtonMultiFeatureUpcoming from './ButtonMultiFeatureUpcoming';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useNavigation } from '@react-navigation/native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';

const ActionPageUpcomingButton = ({ onPress }) => {
  const { authUserState } = useAuthUser();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend } = useSelectedFriend();
  const navigation = useNavigation();
  
  let mainHello = null;
  let satelliteHellos = [];
  let satellitesFirstPage = 2;
  let additionalSatelliteCount = null;
  let additionalHellos = [];

  if (!isLoading && upcomingHelloes.length > 0) {
    mainHello = upcomingHelloes[0];
    satelliteHellos = upcomingHelloes.slice(1);
    additionalSatelliteCount = satelliteHellos.length - satellitesFirstPage;

    if (additionalSatelliteCount > 0) {
      additionalHellos = upcomingHelloes.slice(satellitesFirstPage);
    } else {
      additionalHellos = null;
    }
  }

  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);

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
    const { id, friend_name } = hello; 
    const selectedFriend = id === null ? null : { id, name: friend_name }; 
    setFriend(selectedFriend);
    navigation.navigate('FriendFocus');
    console.log('ALL!!', hello);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonMultiFeatureUpcoming
            onPress={() => handlePress(mainHello)}
            isLoading={isLoading} 
            navigateToFirstPage={navigateToFirstPage}
            headerText={mainHello ? 'UP NEXT' : ''}
            label={mainHello ? mainHello.friend_name : `Hi ${authUserState.user.username}!`}
            additionalText={mainHello ? mainHello.future_date_in_words : ''}
            fontMargin={3}
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
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(friend) => handlePress(friend)} 
          />
        )}
      </Animated.View>

      {!showSecondButton && additionalSatelliteCount > 0 && (
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <View style={styles.svgContainer}>
            <ArrowRightCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
          </View>
        </TouchableOpacity>
      )}

      {showSecondButton && (
        <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
          <View style={styles.svgContainer}>
            <ArrowLeftCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
          </View>
        </TouchableOpacity>
      )}
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
    padding: 4,
    marginRight: -8,
    marginLeft: -10,
  },
  svgContainer: {
    width: 60,  
    height: 60,  
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',  
  },
  SvgImage: {
    transform: [{ scale: .8 }],  
  },
});

export default ActionPageUpcomingButton;
