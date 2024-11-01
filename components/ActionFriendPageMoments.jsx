import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import ButtonLottieAnimationSatellitesMoments from './ButtonLottieAnimationSatellitesMoments';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import TogglerActionButton from '../components/TogglerActionButton';

import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
 
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';
import AddOutlineSvg from '../assets/svgs/add-outline.svg';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ActionFriendPageMoments = ({ 
  onPress, 
  includeHeader=true, 
  headerText='MOMENTS', 
  headerTextColor='white',
  headerFontFamily='Poppins-Regular',
  headerTextSize=16, 
  headerInside=false,
  buttonHeight=260,
  buttonRadius=20,
  headerHeight=30,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30,
  oneBackgroundColor='black', //#2B2B2B 
  animationPaused=true,
  onAddMomentPress=() => {}


}) => {

  const { themeStyles } = useGlobalStyle();

  const navigation = useNavigation();
  const { friendColorTheme } = useSelectedFriend();
  const { capsuleList, capsuleCount } = useCapsuleList();
  const [showSecondButton, setShowSecondButton] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused ] = useState(true);
  
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;


  

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
            <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
        )} 

      <View style={styles.containerInnerRow}>
          <View style={[styles.containerHeaderInside,  { backgroundColor: 'transparent', borderTopRightRadius: buttonRadius }]}>
            {includeHeader && headerInside && (
              <View style={[styles.headerContainer, themeStyles.friendFocusSection, { borderTopRightRadius: buttonRadius, height: headerHeight  }]}>
                <Text style={[styles.headerText, themeStyles.friendFocusSectionText, { fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
                  {headerText} ({capsuleCount})
                </Text>
              </View>
            )} 

          <ButtonLottieAnimationSatellitesMoments
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius} 
            headerText=''
            allItems={capsuleList ? capsuleList : 'Loading...'}
            showGradient={true}
            lightColor={oneBackgroundColor}
            darkColor={oneBackgroundColor} 
            additionalPages={showSecondButton} 
            pauseAnimation={animationPaused}
            onPress={onAddMomentPress}
          /> 
      </View>

      <TogglerActionButton
        showSecondButton={showSecondButton}
        handleNext={handleNext}
        navigateToFirstPage={navigateToFirstPage}
        handleFullScreen={onAddMomentPress}
        navigateToLocationScreen={onAddMomentPress} //the active one
        height={calculatedButtonHeight}
        transparentBackground={true}
        borderRadius={buttonRadius}
        justifyContent={justifyIconContent}
        marginLeft={16} 
        backgroundColor={'transparent'}
        topIconSize={topIconSize}
        bottomIconSize={bottomIconSize}
        iconColor={inactiveIconColor}
        oneButtonOnly={true}
        highlightIconColor={friendColorTheme.lightColor}
        firstPageTopSvg={AddOutlineSvg}
        firstPageBottomSvg={ScrollOutlineSvg}
        secondPageTopSvg={AddOutlineSvg}
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
    padding: 10,
    paddingRight: 6,
  },
  containerInner: {
    flexDirection: 'column',
    width: '100%',  
    backgroundColor: 'transparent',
  },
  containerHeaderInside: { 
    flexDirection: 'column',  
    marginBottom: 0,
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
    marginLeft: 0,
  },
});

export default ActionFriendPageMoments;
