import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesLocations from './ButtonLottieAnimationSatellitesLocations';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg';  

import TogglerActionButton from '../components/TogglerActionButton';
import { useNavigation } from '@react-navigation/native';

import MagGlassSimpleSvg from '../assets/svgs/mag-glass-simple.svg';
import MapSearchOutlineSvg from '../assets/svgs/map-search-outline.svg';
import MapPinOutlineSvg from '../assets/svgs/map-pin-outline.svg';

import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';


const ActionFriendPageLocations = ({ 
  onPress, 
  includeHeader=false, 
  headerText='MEET UP PLACES', 
  headerTextColor='white',
  headerFontFamily='Poppins-Bold',
  headerTextSize=15, 
  headerInside=false,
  buttonHeight=80,
  buttonRadius=10,
  headerHeight=30,
  marginLeft=16,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30

}) => {

  const navigation = useNavigation();

  const { selectedFriend, setFriend, friendColorTheme } = useSelectedFriend();
  const { locationList, setLocationList } = useLocationList(); 
  
  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [lightColor, setLightColor] = useState('black');
  const [darkColor, setDarkColor] = useState('black');


  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? lightColor : 'transparent';

  let mainLocation = null;
  let satelliteLocations = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null; 


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
  
   

  return (
    <View style={[styles.container, {backgroundColor: calculatedBackgroundColor, borderRadius: buttonRadius }]}>
      <View style={[styles.containerInner, {borderRadius: buttonRadius}]}>
      {includeHeader && !headerInside && (
        <View style={[styles.headerContainer, { height: headerHeight}]}>
          <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
            {headerText}
          </Text>
        </View>

      )}
      <View style={styles.containerInnerRow}> 



        <View style={[styles.containerHeaderInside, { backgroundColor: lightColor, borderTopRightRadius: buttonRadius }]}>
          
          {includeHeader && headerInside && (
            <View style={[styles.headerContainer, { backgroundColor: lightColor, borderTopRightRadius: buttonRadius, height: headerHeight}]}>
            <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
          )}

      
        
      <Animated.View style={{ opacity: opacityAnim, flex: 1, zIndex: 1 }}>
        
        {additionalSatelliteCount > 0 ? (
          <ButtonLottieAnimationSatellitesLocations
            onPress={() => {}}
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
            darkColor={darkColor}
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
            onPress={() => {}}
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
        handleFullScreen={navigateToLocationScreen}
        navigateToLocationScreen={navigateToLocationScreen}
        height={calculatedButtonHeight}
        borderRadius={buttonRadius} 
        marginLeft={marginLeft}
        justifyContent={justifyIconContent}
        backgroundColor={friendColorTheme.darkColor}
        topIconSize={topIconSize}
        bottomIconSize={bottomIconSize}
        iconColor={inactiveIconColor}
        highlightIconColor={friendColorTheme.lightColor}
        firstPageTopSvg={MagGlassSimpleSvg}
        firstPageBottomSvg={MapPinOutlineSvg}
        secondPageTopSvg={MagGlassSimpleSvg}
        secondPageBottomSvg={ScrollOutlineSvg}
      />
      </View>
    </View> 
       
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
  containerInner: {
    flexDirection: 'column',
    width: '100%',  
    backgroundColor: 'transparent',
  },
  containerHeaderInside: { 
    flexDirection: 'column',  
    marginBottom: 20, 
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
    height: 70,
    marginBottom: -3,
    color: 'black',
    zIndex: 0,
  
  },
  headerText: {
    marginLeft: 10,
  },
});

export default ActionFriendPageLocations;
