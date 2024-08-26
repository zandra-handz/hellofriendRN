import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import ButtonLottieAnimationSatellitesMoments from './ButtonLottieAnimationSatellitesMoments';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import TogglerActionButton from '../components/TogglerActionButton';

import MagGlassSimpleSvg from '../assets/svgs/mag-glass-simple.svg';
import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
import BookmarkOutlineSvg from '../assets/svgs/bookmark-outline.svg';

import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';


import { useNavigation } from '@react-navigation/native';

const ActionFriendPageMoments = ({ 
  onPress, 
  includeHeader=true, 
  headerText='MOMENTS', 
  headerTextColor='white',
  headerFontFamily='Poppins-Bold',
  headerTextSize=15, 
  headerInside=false,
  buttonHeight=260,
  buttonRadius=20,
  headerHeight=30,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30


}) => {

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


  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? lightColor : 'transparent';


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
        {additionalSatelliteCount > 0 || overrideView ? (
          <ButtonLottieAnimationSatellitesMoments
            onPress={() => {}}
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
            onPress={() => {}}
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
        justifyContent={justifyIconContent}
        marginLeft={16} 
        backgroundColor={friendColorTheme.darkColor}
        topIconSize={topIconSize}
        bottomIconSize={topIconSize}
        iconColor={inactiveIconColor}
        highlightIconColor={friendColorTheme.lightColor}
        firstPageTopSvg={GridViewOutlineSvg}
        firstPageBottomSvg={ScrollOutlineSvg}
        secondPageTopSvg={GridViewOutlineSvg}
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
    paddingLeft: 0,  
  
  },
  headerText: { 
    marginLeft: 10,
  },
 
  animatedView: {
    flex: 1,
  }, 
});

export default ActionFriendPageMoments;
