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
import ButtonPanelFriendFocus from '../components/ButtonPanelFriendFocus';

import HelloFriendFooter from '../components/HelloFriendFooter';

const ScreenFriendFocus = () => {
  const { selectedFriend, friendDashboardData, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();

  const { themeStyles, gradientColors } = useGlobalStyle(); 

  const headers = true;
  const insideHeaders = true;
  const topRadius = 20;
  const radius = 14;
  const buttonMargin = 0;
  const oneBackgroundColor = 'black';

  const pageHeaderHeightTall = 220;
  const pageHeaderHeight = 134;  

  const headerTextColor = 'white';
  const inactiveIconColor = 'white';

  const topIconSize = 28;
  const bottomIconSize = 28;

  const momentsBottomIconSize = 30;

  const showOriginalHeader = false;


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
      {!loadingNewFriend && selectedFriend && (
        <>
            <View style={styles.buttonContainer}>
            <View style={{flexDirection: 'column', height: 100, justifyContent: 'center', alignContent: 'center',  width: '100%'}}>
            <View style={{height: 40, paddingHorizontal: 10, paddingHorizontal: 10,justifyContent: 'center' }}>
              <Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
                {selectedFriend ? selectedFriend.name : ''}
              </Text>

            </View>
            
            
            <View style={{height: 40, paddingHorizontal: 10,justifyContent: 'center' }}>
              <Text style={[styles.headerText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
                Say hello on {friendDashboardData ? `${friendDashboardData[0].future_date_in_words}!` : ' '}
          
              </Text>

            </View>
          </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            
            <View style={{ marginHorizontal: buttonMargin, paddingTop: 20, height: 74, width: '100%' }}>

            <ButtonPanelFriendFocus />
            </View> 
             </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            
            <View style={{ marginTop: 36, marginHorizontal: buttonMargin, width: '100%' }}>
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

          <View style={styles.sectionsContainer}> 
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          

            </View>
            

            <View style={{ marginHorizontal: buttonMargin, marginTop: 4 }}>
              <ComposerFriendImages 
                topIconSize={topIconSize} 
                bottomIconSize={bottomIconSize} 
                buttonHeight={56} 
                headerHeight={44}
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
                buttonHeight={246} 
                buttonRadius={radius} 
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={oneBackgroundColor}
                headerHeight={34} 
                includeHeader={headers} 
                headerInside={true} 
                headerText={'MOMENTS'} 
              /> 
            </View>

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
  friendNameText: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',

  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',

  },
  sectionsContainer: {
    width: '100%',
    borderRadius: 0,
    paddingBottom: 0, 
    paddingVertical: 10,
    paddingHorizontal: 2,
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
    paddingBottom: 14,
    
  },

});
export default ScreenFriendFocus;
