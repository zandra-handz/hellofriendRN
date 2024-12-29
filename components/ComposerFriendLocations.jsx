import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BaseFriendViewLocations from '../components/BaseFriendViewLocations';
import { useLocationList } from '../context/LocationListContext'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

import TogglerActionButton from '../components/TogglerActionButton';
import { useNavigation } from '@react-navigation/native';
import MagGlassSimpleSvg from '../assets/svgs/mag-glass-simple.svg';
import MapPinOutlineSvg from '../assets/svgs/map-pin-outline.svg';
import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';

const ComposerFriendLocations = ({ 
  includeHeader=false, 
  headerText='MEET UP PLACES',  
  headerFontFamily='Poppins-Bold',
  headerTextSize=16, 
  headerInside=false,
  buttonHeight=80,
  buttonRadius=10,
  headerHeight=30,
  marginLeft=16,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30, 

}) => {

  const navigation = useNavigation();
  const { themeStyles } = useGlobalStyle(); 
  const { themeAheadOfLoading } = useFriendList();
  const { locationList } = useLocationList(); 
  const [showSecondButton, setShowSecondButton] = useState(false);
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
 
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
    <View style={[styles.container, themeStyles.friendFocusSection, { borderRadius: buttonRadius }]}>
      <View style={[styles.containerInner, { borderRadius: buttonRadius }]}>
        {includeHeader && !headerInside && (
          <View style={[styles.headerContainer, { height: headerHeight }]}>
            <Text style={[styles.headerText, themeStyles.friendFocusSectionText, {  fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
        )}
        <View style={styles.containerInnerRow}>
          <View style={[styles.containerHeaderInside,  { backgroundColor: 'transparent', borderTopRightRadius: buttonRadius }]}>
            {includeHeader && headerInside && (
              <View style={[styles.headerContainer, themeStyles.friendFocusSection, { borderTopRightRadius: buttonRadius, height: headerHeight  }]}>
                <Text style={[styles.headerText, themeStyles.friendFocusSectionText, { fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
                  {headerText}
                </Text>
              </View>
            )} 

      <View style={{ flex: 1, zIndex: 1, width: '99%' }}>
          <BaseFriendViewLocations 
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}  
            allItems={locationList ? locationList : 'Loading...'} 
 
            satellites={!showSecondButton}  
            additionalPages={showSecondButton} 
         />
        </View>
        </View>
        <View style={{paddingRight: 5}}>

      
          <TogglerActionButton
            showSecondButton={showSecondButton}
            handleNext={handleNext}
            navigateToFirstPage={navigateToFirstPage}
            handleFullScreen={navigateToLocationScreen}
            navigateToLocationScreen={navigateToLocationScreen}
            height={calculatedButtonHeight}
            transparentBackground={true}
            borderRadius={0} 
            marginLeft={marginLeft}
            justifyContent={justifyIconContent}
            backgroundColor={'transparent'}
            topIconSize={topIconSize}
            bottomIconSize={bottomIconSize}
            iconColor={inactiveIconColor}
            highlightIconColor={themeAheadOfLoading.darkColor}
            oneButtonOnly={false}
            firstPageTopSvg={MagGlassSimpleSvg}
            firstPageBottomSvg={MapPinOutlineSvg}
            secondPageTopSvg={MagGlassSimpleSvg}
            secondPageBottomSvg={ScrollOutlineSvg}
          />
          </View>
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
    marginBottom: -3, 
    zIndex: 0,
  
  },
  headerText: {
    marginLeft: 10,
  },
});

export default ComposerFriendLocations;
