import React, { useState } from 'react';
import { View, StyleSheet, Animated  } from 'react-native';
import ButtonLottieAnimationTwoSectionsSvg from '../components/ButtonLottieAnimationTwoSectionsSvg';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import AlertPanelBottom from './AlertPanelBottom';
import { useNavigation } from '@react-navigation/native';
import LoadingPage from '../components/LoadingPage';
import ButtonArrowSvgAndLabel from '../components/ButtonArrowSvgAndLabel';
import LizardSvg from '../assets/svgs/lizard';

const ActionFriendPageHeader = ({  
  buttonHeight=140,
  headerRadius=30, 
  headerTopRadius=0, 
  Deselector=false }) => {

  const navigation = useNavigation();

  const { selectedFriend, friendDashboardData, friendColorTheme, calculatedThemeColors, loadingNewFriend, setFriend } = useSelectedFriend();
  const [showProfile, setShowProfile] = useState(false); 


  const handleDeselect = () => {
    if (Deselector) {
      setFriend(null);
    }
  };

  const navigateBackToFriendFocus = () => {
    navigation.navigate('FriendFocus');
  };

    // Function to handle button press based on Deselector
    const handlePress = () => {
      if (Deselector) {
        navigateBackToFriendFocus();
      } else {
        setShowProfile(true);
      }
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
      {Deselector && !loadingNewFriend && friendDashboardData && (
        
        <ButtonArrowSvgAndLabel 
          direction='profile'
          screenSide='left'
          setProfileIconColor={true}
          profileIconColor={[calculatedThemeColors.lightColor, calculatedThemeColors.darkColor]}
          label='view'
          onPress={navigateBackToFriendFocus}
          /> 
      )}
      {friendDashboardData && (
      <Animated.View style={{ flex: 1 }}>
        <ButtonLottieAnimationTwoSectionsSvg
           onPress={Deselector ? handlePress : null} 
          buttonHeight={Deselector ? 140 : buttonHeight}
          borderRadius={headerRadius}
          borderTopRadius={Deselector ? 30 : headerTopRadius}
          preLabelFontSize={Deselector ? 18 : 28}
          mainButtonWidth={Deselector ? '84%' : '77%'}
          headerText={Deselector ? 'SELECTED:' : selectedFriend ? selectedFriend.name : ''}
          preLabelColor={Deselector && calculatedThemeColors ? calculatedThemeColors.lightColor : 'white'}
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
          satelliteSectionWidth={Deselector ? '28%' : '33.33%'}
          satelliteSectionMarginLeft={Deselector ? -22 : -20}
          satelliteCount={Deselector ? 2 : 0} // Show two satellites if Deselector is true
          satelliteHellos={Deselector ? [{ label: 'Deselect', onPress: handleDeselect }] : []} // Satellite button to reset the selected friend
          satellitesOrientation="vertical" // Adjust orientation if needed
          satelliteHeight="20%" // Adjust height if needed
          satelliteOnPress={handleDeselect} 
        />
      </Animated.View>
       )}

      <AlertPanelBottom
        visible={showProfile}
        profileData={selectedFriend}
        onClose={() => setShowProfile(false)}
      />
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
