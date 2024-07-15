import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesLocations from './ButtonLottieAnimationSatellitesLocations';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; // Import the SVG
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';


const ActionFriendPageLocations = ({ onPress }) => {
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { locationList, setLocationList } = useLocationList();


  
  let mainLocation = null;
  let satelliteLocations = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null; 

  if (locationList.length > 0) {
    mainLocation = locationList[0];
    satelliteLocations = locationList.slice(1);
    additionalSatelliteCount = satelliteLocations.length - satellitesFirstPage;

 
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

  
  const handlePress = (location) => {
    const { title, address } = location;   
    console.log('ALL LOCATIONS!!', location);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonLottieAnimationSatellitesLocations
            onPress={() => handlePress(mainLocation)} 
            navigateToFirstPage={navigateToFirstPage}
            headerText=''
            headerSvg={<PushPinSolidSvg width={20} height={20}  />}
            
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
            lightColor="black"
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
            satelliteLocations={satelliteLocations}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(location) => handlePress(location)} 
          />
        )}
      </Animated.View>

      {!showSecondButton && additionalSatelliteCount > 0 && (
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <View style={styles.svgContainer}>
            <ArrowFullScreenOutlineSvg width={70} height={70} style={styles.SvgImage} />
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

export default ActionFriendPageLocations;
