import React from 'react';
import { View, Text,  StyleSheet } from 'react-native';
  
import { useSelectedFriend } from '../context/SelectedFriendContext';

import ActionFriendPageHeader from '../components/ActionFriendPageHeader'; // Import the new component
import ActionFriendPageMoments from '../components/ActionFriendPageMoments'; // Import the new component
import ActionFriendPageImages from '../components/ActionFriendPageImages'; // Import the new component
import ActionFriendPageHelloes from '../components/ActionFriendPageHelloes'; // Import the new component
import ActionFriendPageLocations from '../components/ActionFriendPageLocations'; // Import the new component

import { useGlobalStyle } from '../context/GlobalStyleContext';

import HelloFriendFooter from '../components/HelloFriendFooter';

const ScreenFriendFocus = () => {
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle(); 

  const headers = true;
  const insideHeaders = true;
  const topRadius = 20;
  const radius = 20;
  const buttonMargin = 10;

  const pageHeaderHeightTall = 220;
  const pageHeaderHeight = 168; 

  const headerTextColor = 'white';
  const inactiveIconColor = 'white';

  const topIconSize = 28;
  const bottomIconSize = 28;


  return (
    <View style={[styles.container, themeStyles.container]}>
      {loadingNewFriend && (
        <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingTextBold}>Loading data for {selectedFriend.name}!</Text>
        </View>
      )}
      {!loadingNewFriend && (
        <>
            <View style={styles.buttonContainer}>
            <View style={{marginHorizontal: buttonMargin}}> 
            <ActionFriendPageHeader buttonHeight={pageHeaderHeight} headerRadius={radius} headerTopRadius={topRadius}/>
            </View>
            <View style={{marginHorizontal: buttonMargin}}>
              <ActionFriendPageLocations topIconSize={topIconSize} bottomIconSize={bottomIconSize} buttonHeight={74} buttonRadius={radius} inactiveIconColor={inactiveIconColor} headerHeight={30} includeHeader={false} headerInside={false} headerText={'LOCATIONS'} />
            </View>
            <View style={{marginHorizontal: buttonMargin}}>
            <ActionFriendPageImages topIconSize={topIconSize} bottomIconSize={bottomIconSize} buttonHeight={64} buttonRadius={radius} inactiveIconColor={inactiveIconColor} headerHeight={30} includeHeader={false} headerInside={false} headerText={'IMAGES'}/> 
            </View>
            <View style={{marginHorizontal: buttonMargin}}>
            <ActionFriendPageMoments topIconSize={topIconSize} bottomIconSize={bottomIconSize} buttonHeight={260} buttonRadius={radius} inactiveIconColor={inactiveIconColor} headerHeight={30} includeHeader={headers} headerInside={insideHeaders} headerText={'MOMENTS'}/> 
            </View>

            <View style={{marginHorizontal: buttonMargin}}>
            <ActionFriendPageHelloes topIconSize={topIconSize} bottomIconSize={bottomIconSize} buttonHeight={72} buttonRadius={radius} inactiveIconColor={inactiveIconColor} headerHeight={30} includeHeader={headers} headerInside={insideHeaders} headerText={'LAST HELLO'} />
            </View>
            <HelloFriendFooter /> 
            </View>  
            </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 0,
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
  },

});
export default ScreenFriendFocus;
