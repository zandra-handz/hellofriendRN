import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellites from './ButtonLottieAnimationSatellites';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useNavigation } from '@react-navigation/native';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ActionPageUpcomingButton = ({ onPress }) => {
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend } = useSelectedFriend();
  const navigation = useNavigation();
  
  let mainHello = null;
  let satelliteHellos = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalHellos = [];

  if (!isLoading && upcomingHelloes.length > 0) {
    mainHello = upcomingHelloes[0];
    satelliteHellos = upcomingHelloes.slice(1);
    additionalSatelliteCount = satelliteHellos.length - satellitesFirstPage;

    if (additionalSatelliteCount > 0) {
      additionalHellos = upcomingHelloes.slice(satellitesFirstPage + 1);
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
          <ButtonLottieAnimationSatellites
            onPress={() => handlePress(mainHello)}
            isLoading={isLoading}
            navigateToFirstPage={navigateToFirstPage}
            label={mainHello ? mainHello.friend_name : 'Loading...'}
            additionalText={mainHello ? mainHello.future_date_in_words : 'Loading...'}
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
            additionalPages={showSecondButton}
            additionalSatellites={additionalHellos}
            satelliteOnPress={(friend) => handlePress(friend)} 
          />
        ) : (
          <ButtonLottieAnimationSatellites
            onPress={() => handlePress(mainHello)}
            navigateToFirstPage={navigateToFirstPage}
            label={mainHello ? mainHello.friend_name : 'Loading...'}
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
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      )}

      {showSecondButton && (
        <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
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
    padding: 10,
    marginRight: 10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ActionPageUpcomingButton;
