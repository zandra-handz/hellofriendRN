import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import ButtonLottieAnimationSatellitesMoments from './ButtonLottieAnimationSatellitesMoments';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import TogglerActionButton from '../components/TogglerActionButton';

import { useNavigation } from '@react-navigation/native';

const ActionFriendPageMoments = ({ onPress, includeHeader=false, headerText='MOMENTS', headerInside=false }) => {

  const navigation = useNavigation();
  const { selectedFriend, friendDashboardData, friendColorTheme } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();
  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const mainMoment = capsuleList.length > 0 ? capsuleList[0] : null;
  const satelliteMoments = capsuleList.length > 1 ? capsuleList.slice(1) : [];
  const additionalSatelliteCount = satelliteMoments.length - 1;

  const [lightColor, setLightColor] = useState('black');
  const [darkColor, setDarkColor] = useState('black');

  const buttonHeight = 260;
  const buttonRadius = 20;

  const headerHeight = 30;

  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? lightColor : 'transparent';


  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if(friendColorTheme.invertGradient) {
        setLightColor(friendColorTheme.lightColor || 'black');
        setDarkColor(friendColorTheme.darkColor || 'black');
      } else {
        setLightColor(friendColorTheme.darkColor || 'black');
        setDarkColor(friendColorTheme.lightColor || 'black');
      };
    }
    if (friendColorTheme && friendColorTheme.useFriendColorTheme == false) {
      setLightColor('black');
      setDarkColor('black');
    }
  }, [friendColorTheme]);
 
  

  let satellitesFirstPage = 1;

  let overrideView = true;

  const navigateToMomentsScreen = () => {
    navigation.navigate('Moments');
    if (onPress) onPress();
  };

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
        {additionalSatelliteCount > 0 || overrideView ? (
          <ButtonLottieAnimationSatellitesMoments
            onPress={() => handlePress(mainMoment)} 
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainMoment ? mainMoment.capsule : 'Loading...'}
            allItems={capsuleList ? capsuleList : 'Loading...'}
            additionalText={mainMoment ? mainMoment.typed_category : ''}
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
            showShape={false}
            shapePosition="right"
            shapeSource={require('../assets/shapes/greenfloral.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false} 
            backgroundColor="black"
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteMoments={satelliteMoments}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={showSecondButton}
            additionalSatellites={capsuleList}
            satelliteOnPress={(moment) => handlePress(moment)} 
          />
        ) : (
          <ButtonLottieAnimationSatellitesMoments
            onPress={() => handlePress(mainMoment)}
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainMoment ? mainMoment.capsule : 'Loading...'}
            allItems={capsuleList ? capsuleList : 'Loading...'}
            
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234} 
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showShape={false}
            shapePosition="right"
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            showGradient={true}
            lightColor={darkColor}
            darkColor={darkColor}
            backgroundColor="transparent"
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteMoments={satelliteMoments}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(moment) => handlePress(moment)} 
          />
        )}
      </Animated.View>

      </View>

      <TogglerActionButton
        showSecondButton={showSecondButton}
        handleNext={handleNext}
        navigateToFirstPage={navigateToFirstPage}
        handleFullScreen={navigateToMomentsScreen}
        navigateToLocationScreen={navigateToMomentsScreen}
        height={calculatedButtonHeight}
        borderRadius={buttonRadius}
        marginLeft={22} 
        backgroundColor={friendColorTheme.darkColor}
        topIconSize={34}
        bottomIconSize={34}
        iconColor={'black'}
        highlightIconColor={friendColorTheme.lightColor}
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
    backgroundColor: 'transparent',
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
    paddingLeft: 10,  
  
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    color: 'black',
    fontSize: 18,
  },
 
  animatedView: {
    flex: 1,
  }, 
});

export default ActionFriendPageMoments;
