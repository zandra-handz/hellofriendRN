import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import ButtonLottieAnimationSatellitesMoments from './ButtonLottieAnimationSatellitesMoments';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import TogglerActionButton from '../components/TogglerActionButton';

import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
 
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';


import { useNavigation } from '@react-navigation/native';

const ActionFriendPageMoments = ({ 
  onPress, 
  includeHeader=true, 
  headerText='MOMENTS', 
  headerTextColor='white',
  headerFontFamily='Poppins-Regular',
  headerTextSize=15, 
  headerInside=false,
  buttonHeight=260,
  buttonRadius=20,
  headerHeight=30,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30,


}) => {

  const navigation = useNavigation();
  const { friendColorTheme, calculatedThemeColors } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();
  const [showSecondButton, setShowSecondButton] = useState(false);
 
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? calculatedThemeColors.lightColor : 'transparent';

  const navigateToMomentsScreen = () => {
    navigation.navigate('Moments');
    if (onPress) onPress();
  };

  const navigateToFirstPage = () => {
    setShowSecondButton(false); 
  };

  const handleNext = () => {
    setShowSecondButton(true); 
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



      <View style={[styles.containerHeaderInside, { backgroundColor: calculatedThemeColors.lightColor, borderTopRightRadius: buttonRadius }]}>
          {includeHeader && headerInside && (
            <View style={[styles.headerContainer, { backgroundColor: calculatedThemeColors.lightColor, borderTopRightRadius: buttonRadius, height: headerHeight}]}>
            <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
          )}
      <View style={{ flex: 1, zIndex: 1 }}>
          <ButtonLottieAnimationSatellitesMoments
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius} 
            headerText='LAST ADDED'
            allItems={capsuleList ? capsuleList : 'Loading...'}
            showGradient={true}
            lightColor={calculatedThemeColors.lightColor}
            darkColor={calculatedThemeColors.darkColor}   
            additionalPages={showSecondButton} 
          />
        </View>
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
        bottomIconSize={bottomIconSize}
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
});

export default ActionFriendPageMoments;
