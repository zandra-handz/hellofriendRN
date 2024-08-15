import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesLocations from './ButtonLottieAnimationSatellitesLocations';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; // Import the SVG

import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';
import ActionFriendPageAllLocations from '../components/ActionFriendPageAllLocations';
import TogglerActionButton from '../components/TogglerActionButton'; // Import the new component
import { useNavigation } from '@react-navigation/native';

const ActionFriendPageLocations = ({ onPress, includeHeader=true, headerText='PINNED', headerInside=true}) => {

  const navigation = useNavigation();

  const { selectedFriend, setFriend, friendColorTheme } = useSelectedFriend();
  const { locationList, setLocationList } = useLocationList();
  const [isFSModalVisible, setIsFSModalVisible] = useState(false);
  
  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [lightColor, setLightColor] = useState('black');
  const [darkColor, setDarkColor] = useState('black');

  const buttonHeight = 90;
  const buttonRadius = 20;

  const headerHeight = 30;

  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? lightColor : 'transparent';


  useEffect(() => {
    if (headerInside) {
      
    }

  }, []);




  
  let mainLocation = null;
  let satelliteLocations = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null; 


  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if(friendColorTheme.invertGradient) {
        setLightColor(friendColorTheme.lightColor || 'black');
        setDarkColor(friendColorTheme.lightColor || 'black');
      } else {
        setLightColor(friendColorTheme.darkColor || 'black');
        setDarkColor(friendColorTheme.darkColor || 'black');
      };
    }
    if (friendColorTheme && friendColorTheme.useFriendColorTheme == false) {
      setLightColor('black');
      setDarkColor('black');
    }
  }, [friendColorTheme]);

  const navigateToLocationScreen = ({ onPress }) =>  {
    navigation.navigate('Locations');
    if (onPress) onPress();

  };

  if (locationList.length > 0) {
    mainLocation = locationList[0];
    satelliteLocations = locationList.slice(1);
    additionalSatelliteCount = satelliteLocations.length - satellitesFirstPage;

 
  }
 

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
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleFullScreen = () => {
    setIsFSModalVisible(true); // Set modal visible when fullscreen button is pressed
  };

  const closeModal = () => {
    setIsFSModalVisible(false); // Close the modal
  };

  
  const handlePress = (location) => {
    const { title, address } = location;   
    console.log('ALL LOCATIONS!!', location);
  };

  return (
    <View style={[styles.container, {backgroundColor: calculatedBackgroundColor, borderRadius: buttonRadius }]}>
      <View style={[styles.containerInner, {borderRadius: buttonRadius}]}>
      {includeHeader && !headerInside && (
        <View style={[styles.headerContainer, { height: headerHeight}]}>
          <Text style={styles.headerText}>
            {headerText}
          </Text>
        </View>

      )}
      <View style={styles.containerInnerRow}> 



        <View style={styles.containerHeaderInside}>
          {includeHeader && headerInside && (
            <View style={[styles.headerContainer, { backgroundColor: lightColor, borderTopRightRadius: buttonRadius, height: headerHeight}]}>
            <Text style={styles.headerText}>
              {headerText}
            </Text>
          </View>
          )}

      
        
      <Animated.View style={{ opacity: opacityAnim, flex: 1, zIndex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonLottieAnimationSatellitesLocations
            onPress={() => handlePress(mainLocation)} 
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            navigateToFirstPage={navigateToFirstPage}
            headerText=''
            headerSvg={<PushPinSolidSvg width={20} height={20} color="white" />}
            
            firstItem={mainLocation ? mainLocation.address : 'Loading...'}
            allItems={locationList ? locationList : 'Loading...'}
            additionalText={mainLocation ? mainLocation.title : ''}
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            showGradient={true}
            lightColor={lightColor}
            darkColor={lightColor}
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            showShape={false}
            shapeSource={require('../assets/shapes/coffeestarbux.png')}
            shapeWidth={240}
            shapeHeight={240}
            shapePositionValue={-104}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteLocations={satelliteLocations}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={showSecondButton}
            additionalSatellites={locationList}
            satelliteOnPress={(location) => handlePress(location)} 
          />
        ) : (
          <ButtonLottieAnimationSatellitesLocations
            onPress={() => handlePress(mainLocation)}
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainLocation ? mainLocation.address : 'Loading...'}
            allItems={locationList ? locationList : 'Loading...'}
             
            headerSvg={<PushPinSolidSvg width={20} height={20} />}
            
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234} 
            showGradient={true}
            lightColor={lightColor}
            darkColor={lightColor}
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
            satelliteLocations={satelliteLocations}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(location) => handlePress(location)} 
          />
        )}
      </Animated.View>

      </View>
      

      <TogglerActionButton
        showSecondButton={showSecondButton}
        handleNext={handleNext}
        navigateToFirstPage={navigateToFirstPage}
        handleFullScreen={handleFullScreen}
        navigateToLocationScreen={navigateToLocationScreen}
        height={calculatedButtonHeight}
        borderRadius={buttonRadius} 
        backgroundColor={friendColorTheme.lightColor}
        topIconSize={34}
        bottomIconSize={34}
        iconColor={friendColorTheme.darkColor}
      />
      </View>
       </View> 
      
      <ActionFriendPageAllLocations
      isModalVisible={isFSModalVisible}
      toggleModal={closeModal} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',  
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0, 
  },
  containerInner: {
    flexDirection: 'column',
    width: '100%',  
    backgroundColor: 'transparent',
  },
  containerHeaderInside: { 
    flexDirection: 'column', 
    backgroundColor: 'transparent',
    flex: 1,
    zIndex: 1,
    },
 
  containerInnerRow: {
    flexDirection: 'row',
    width: '100%',  
    backgroundColor: 'transparent',
  },
  headerContainer: { 
    textAlign: 'left', 
    justifyContent: 'center',
    paddingLeft: 10,  
  
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
    fontSize: 18,
  },
});

export default ActionFriendPageLocations;
