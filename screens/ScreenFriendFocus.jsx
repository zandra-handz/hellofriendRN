import React from 'react';
import { View, Text,  StyleSheet } from 'react-native';
  
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 

import ActionFriendPageHeader from '../components/ActionFriendPageHeader'; // Import the new component
import ActionFriendPageMoments from '../components/ActionFriendPageMoments'; // Import the new component
import ComposerFriendImages from '../components/ComposerFriendImages'; // Import the new component
import ComposerFriendHelloes from '../components/ComposerFriendHelloes'; // Import the new component
import ComposerFriendLocations from '../components/ComposerFriendLocations'; 

import { useGlobalStyle } from '../context/GlobalStyleContext';

import HelloFriendFooter from '../components/HelloFriendFooter';

const ScreenFriendFocus = () => {
  const { selectedFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();

  const { themeStyles, gradientColors } = useGlobalStyle(); 

  const headers = true;
  const insideHeaders = true;
  const topRadius = 20;
  const radius = 20;
  const buttonMargin = 4;
  const oneBackgroundColor = 'black';

  const pageHeaderHeightTall = 220;
  const pageHeaderHeight = 134;  

  const headerTextColor = 'white';
  const inactiveIconColor = 'white';

  const topIconSize = 28;
  const bottomIconSize = 28;

  const momentsBottomIconSize = 30;


  return (
    <LinearGradient
    colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, themeStyles.signinContainer]}
  >
      {loadingNewFriend && (
        <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingTextBold}>Loading data for {selectedFriend.name}!</Text>
        </View>
      )}
      {!loadingNewFriend && (
        <>
            <View style={styles.buttonContainer}>
            <View style={{ marginHorizontal: buttonMargin }}>
              <ActionFriendPageHeader 
                buttonHeight={pageHeaderHeight} 
                headerRadius={radius} 
                headerTopRadius={topRadius} 
              />
            </View>

          <View style={styles.sectionsContainer}> 
            <View style={{ marginTop: 8, marginHorizontal: buttonMargin }}>
              <ComposerFriendLocations 
                topIconSize={topIconSize} 
                bottomIconSize={bottomIconSize} 
                buttonHeight={72} 
                buttonRadius={radius} 
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={oneBackgroundColor}
                headerHeight={30} 
                includeHeader={false} 
                headerInside={false} 
                headerText={'PINNED'} 
              />
            </View>

            <View style={{ marginHorizontal: buttonMargin, marginTop: 4 }}>
              <ComposerFriendImages 
                topIconSize={topIconSize} 
                bottomIconSize={bottomIconSize} 
                buttonHeight={56} 
                headerHeight={40}
                buttonRadius={radius} 
                includeHeader={true}
                headerInside={true}
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={'transparent'} 
              /> 
            </View>

            <View style={{ marginTop: 4, marginHorizontal: buttonMargin }}>
              <ActionFriendPageMoments 
                topIconSize={topIconSize} 
                bottomIconSize={momentsBottomIconSize} 
                buttonHeight={236} 
                buttonRadius={radius} 
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={oneBackgroundColor}
                headerHeight={30} 
                includeHeader={headers} 
                headerInside={true} 
                headerText={'MOMENTS'} 
              /> 
            </View>
            </View>

            <View style={{ marginTop: 10, marginHorizontal: buttonMargin }}>
              <ComposerFriendHelloes 
                topIconSize={topIconSize} 
                bottomIconSize={bottomIconSize} 
                buttonHeight={52} 
                buttonRadius={radius} 
                showGradient={false}
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={'transparent'}
                headerHeight={24} 
                includeHeader={headers} 
                headerInside={false} 
                headerText={'LAST HELLO'} 
              />
            </View>
            </View>
           

            <HelloFriendFooter /> 
            
            </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2B2B',
    paddingVertical: 0,
  }, 
  sectionsContainer: {
    width: '100%',
    borderRadius: 20,
    paddingBottom: 8,
    backgroundColor: 'rgba(41, 41, 41, 0.2)',  // Semi-transparent background
  },
  loadingTextContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingBottom: 6, 
    paddingTop: 0,
  },
  loadingText: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',

  },
  loadingTextBold: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',

  },
  navigationButton: {
    position: 'absolute',
   
    right: 0,
    padding: 15,
    backgroundColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  }, 
  buttonContainer: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,  
    paddingTop: 0, 
    paddingBottom: 10,
  },

});
export default ScreenFriendFocus;
