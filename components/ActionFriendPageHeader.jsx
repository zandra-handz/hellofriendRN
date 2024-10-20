import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated} from 'react-native';
import ButtonLottieAnimationTwoSectionsSvg from '../components/ButtonLottieAnimationTwoSectionsSvg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 
import { useNavigation } from '@react-navigation/native';
import LoadingPage from '../components/LoadingPage';
import ButtonArrowSvgAndLabel from '../components/ButtonArrowSvgAndLabel';
import LizardSvg from '../assets/svgs/lizard';

const DOUBLE_PRESS_DELAY = 300;

const ActionFriendPageHeader = ({  
  buttonHeight=140,
  headerRadius=30, 
  headerTopRadius=0, 
  Deselector=false,
  handleNext,
 handleDeselect,
 }) => {

  const navigation = useNavigation();
  const { themeStyles } = useGlobalStyle();

  const { selectedFriend, friendDashboardData, friendColorTheme, calculatedThemeColors, loadingNewFriend, setFriend } = useSelectedFriend();
  
  const lastPress = useRef(0);
  const pressTimeout = useRef(null);
  const [showProfile, setShowProfile] = useState(false); 




  const navigateBackToFriendFocus = () => {
    navigation.navigate('FriendFocus');
  };

  const navigateToMoments = () => {
    navigation.navigate('Moments');
  };

   
  const handleSinglePress = () => {
    if (Deselector) {
      navigateBackToFriendFocus();
    } else {
      setShowProfile(true);
    }
  };

  const handleDoublePress = () => {
    console.log('Double press detected');
    navigateToMoments();
    // Add your double press logic here
  };

  const handlePress = () => {
    const now = Date.now();
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) { 
      clearTimeout(pressTimeout.current);
      handleDoublePress();
    } else { 
      pressTimeout.current = setTimeout(() => {
        handleSinglePress();
      }, DOUBLE_PRESS_DELAY);
    }
    lastPress.current = now;
  };
 
  return (
    <View style={[styles.container, {borderWidth: 0, borderRadius: headerRadius, borderColor: selectedFriend && !loadingNewFriend? calculatedThemeColors.darkColor : 'transparent'}]}>
      {loadingNewFriend && (
      <View style={styles.loadingContainer}>

        <LoadingPage 
          loading={loadingNewFriend}
          spinnerSize={70} 
        />
      </View>
    )} 
    
      {friendDashboardData && (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Animated.View style={{ flex: 1, flexDirection: 'row', width: '40%'}}>
        <ButtonLottieAnimationTwoSectionsSvg
          onPress={Deselector ? handlePress : null} 
          buttonHeight={Deselector ? 'auto' : 'auto'}
          borderRadius={headerRadius}
          borderTopRadius={Deselector ? 30 : headerTopRadius}
          preLabelFontSize={Deselector ? 18 : 28}
          mainButtonWidth={Deselector ? '84%' : '77%'}
          headerText={Deselector ? 'SELECTED:' : selectedFriend ? selectedFriend.name : ''}
          preLabelColor={Deselector && calculatedThemeColors ? 'white' : 'white'}
          navigateToFirstPage={false} 
          labelColor={'white'}
          labelFontSize={Deselector? 30 : 17}
          label={Deselector? selectedFriend ? selectedFriend.name : '' : 'Say hello on '}
          additionalTextSize={16}
          additionalText={friendDashboardData ? `${friendDashboardData[0].future_date_in_words}` : ' '}
          
          showLabelTwo={false}
          fontMargin={3}
          animationSource={require('../assets/anims/heartinglobe.json')}
          rightSideAnimation={false} 
          animationWidth={234}
          animationHeight={234} 
          labelContainerMarginHorizontal={4}
          animationMargin={-64}
          shapePosition="right"
          showGradient={true}
          lightColor={Deselector ? 'black' : 'transparent'}
          darkColor={Deselector ? 'black' : 'transparent'}
          SourceSvg={null}
          SourceSecondSvg={LizardSvg}
          svgColor={calculatedThemeColors.darkColor} 
          shapeWidth={190}
          shapeHeight={190}
          showShape={Deselector? false : false} 
          showSecondShape={false} // lizard
          shapePositionValue={-214}
          showIcon={false}
          satellites={Deselector} // Toggle satellite section based on Deselector
          satelliteSectionPosition="right"
          satelliteSectionWidth={Deselector ? '0%' : '33.33%'}
          satelliteSectionMarginLeft={Deselector ? -22 : -20}
          //removed deselector button by setting 2 : 0 to 0 : 0 below:
          satelliteCount={Deselector ? 0 : 0} // Show two satellites if Deselector is true
          satelliteHellos={Deselector ? [{ label: 'Deselect', onPress: handleDeselect }] : []} // Satellite button to reset the selected friend
          satellitesOrientation="vertical" // Adjust orientation if needed
          satelliteHeight="20%" // Adjust height if needed
          satelliteOnPress={handleDeselect} 
        />
           
      </Animated.View>
      
      <ButtonArrowSvgAndLabel 
      direction='right'
      icon='two-users'
      screenSide='right'
      label='swap'
      onPress={handleNext}
      /> 
      </View>
       )}
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',  
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,  
  },  
  loadingContainer: {
    width: '100%',
    height: 140,
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }, 
});

export default ActionFriendPageHeader;
