import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BaseFriendViewLocations from '../components/BaseFriendViewLocations';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import TogglerActionButton from '../components/TogglerActionButton';
import { useNavigation } from '@react-navigation/native';
import MagGlassSimpleSvg from '../assets/svgs/mag-glass-simple.svg';
import MapPinOutlineSvg from '../assets/svgs/map-pin-outline.svg';
import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';

const ComposerFriendLocations = ({ 
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
  bottomIconSize=30,
  oneBackgroundColor='black', //#2B2B2B

}) => {

  const navigation = useNavigation();

  const { friendColorTheme, calculatedThemeColors } = useSelectedFriend();
  const { locationList } = useLocationList(); 
  const [showSecondButton, setShowSecondButton] = useState(false);
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? calculatedThemeColors.lightColor : 'transparent';

  const navigateToLocationScreen = ({ onPress }) =>  {
    navigation.navigate('Locations');
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
          <BaseFriendViewLocations 
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}  
            allItems={locationList ? locationList : 'Loading...'} 
            showGradient={true}
            lightColor={oneBackgroundColor}
            darkColor={oneBackgroundColor} 
            satellites={!showSecondButton}  
            additionalPages={showSecondButton} 
         />
        </View>
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
            backgroundColor={oneBackgroundColor}
            topIconSize={topIconSize}
            bottomIconSize={bottomIconSize}
            iconColor={inactiveIconColor}
            highlightIconColor={calculatedThemeColors.darkColor}
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

export default ComposerFriendLocations;
