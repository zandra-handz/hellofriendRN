import React from 'react';
import { View, Text,  StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import LastHelloBanner from '../components/LastHelloBanner';
import ActionFriendPageMoments from '../components/ActionFriendPageMoments'; // Import the new component
import ComposerFriendImages from '../components/ComposerFriendImages'; // Import the new component
import { useNavigation } from '@react-navigation/native';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonPanelFriendFocus from '../components/ButtonPanelFriendFocus';
import LoadingPage from '../components/LoadingPage';
import { Dimensions } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter';

const ScreenFriendFocus = () => {
  const { selectedFriend, friendDashboardData, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles, gradientColors } = useGlobalStyle(); 
  const navigation = useNavigation();

  const headers = true; 
  const radius = 2;
  const buttonMargin = 0;
  const oneBackgroundColor = 'black'; 
  const inactiveIconColor = 'white';

  const topIconSize = 28;
  const bottomIconSize = 28;

  const momentsBottomIconSize = 30;

  const showOriginalHeader = false;

  const windowHeight = Dimensions.get('window').height;
  const bottomSectionHeight = windowHeight * 0.7; // Fixed 70% for bottom
  const topSectionHeight = windowHeight - bottomSectionHeight; 
  const topSectionPadding = Dimensions.get('window').height * 0.01;
  const bottomSectionPadding = Dimensions.get('window').height * 0.01;

  const navigateToMomentsScreen = () => {
    navigation.navigate('Moments'); 
  };


  return (
    <LinearGradient
    colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, themeStyles.signinContainer]}
  >
      {loadingNewFriend && themeAheadOfLoading && (
          <View style={[styles.loadingWrapper, {backgroundColor: themeAheadOfLoading.lightColor}]}>
          <LoadingPage
            loading={loadingNewFriend} 
            spinnerType='wander'
            color={themeAheadOfLoading.darkColor}
            includeLabel={true}
            label="Loading"
          />
          </View>
      )}
      {!loadingNewFriend && selectedFriend && (
        <>
          <View style={[styles.buttonContainer]}>
            <View style={[styles.topSectionContainer, {paddingTop: topSectionPadding, height: topSectionHeight}]}>

            <View style={{flexDirection: 'column',paddingHorizontal: 10, justifyContent: 'flex-start',  width: '100%'}}>
               <>
                <Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
                  {selectedFriend ? selectedFriend.name : ''}
                </Text>
                <Text
                  style={[styles.headerText, themeStyles.subHeaderText, { color: calculatedThemeColors.fontColor }]}
                  numberOfLines={2} // Allows a maximum of 2 lines (you can adjust this value as needed)
                  ellipsizeMode="tail" // Adds "..." if the text is too long
                >
                  Say hi on {friendDashboardData ? `${friendDashboardData[0].future_date_in_words}!` : ' '}
                </Text> 
                
               </>
            </View>
 
              <View style={{ marginHorizontal: buttonMargin,  zIndex: 2, top: '12%', height: '33%',  width: '100%' }}>
                
              <LastHelloBanner /> 
                <ButtonPanelFriendFocus />
                
              </View>     
          </View>

          <View style={[styles.bottomSectionContainer, {height: bottomSectionHeight, paddingBottom: bottomSectionPadding}]}>  
              <TouchableOpacity onPress={navigateToMomentsScreen} style={[styles.addHelloButton, {backgroundColor: calculatedThemeColors.lightColor}]}>
                <Text style={styles.addHelloText}>FOCUS MODE</Text>
              </TouchableOpacity>
          
            <View>
            <View  style={[styles.recentlyAddedButton, themeStyles.genericTextBackground]}>
                <Text numberOfLines={1} style={[styles.recentlyAddedText, themeStyles.genericText]}>RECENTLY ADDED</Text>
              </View>
          

           
              <ComposerFriendImages 
                topIconSize={topIconSize} 
                bottomIconSize={bottomIconSize} 
                buttonHeight={'auto'} 
                headerHeight={'auto'}
                buttonRadius={radius} 
                includeHeader={true}
                headerInside={true}
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={'transparent'} 
              />  

            <View style={{ marginTop: 0, borderTopWidth: .4, borderColor: themeStyles.genericText.color, marginHorizontal: buttonMargin }}>
              <ActionFriendPageMoments 
                topIconSize={topIconSize} 
                bottomIconSize={momentsBottomIconSize} 
                buttonHeight={276} 
                buttonRadius={radius} 
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={oneBackgroundColor}
                headerHeight={24} 
                includeHeader={headers} 
                headerInside={true} 
                headerText={'MOMENTS'} 
              /> 
            </View>
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
    marginTop: 0,
    fontFamily: 'Poppins-Regular',

  },
  topSectionContainer: {
    width: '100%',  
    flexDirection: 'column',
    justifyContent: 'flex-start', 
  },
  bottomSectionContainer: {
    width: '100%',   
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: 'rgba(41, 41, 41, 0.2)',  // Semi-transparent background
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  recentlyAddedButton: {  
    width: '100%', 
    paddingHorizontal: 10, 
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height: '11%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',  

},
addHelloButton: {
 
  width: '100%',
  textAlign: 'right',
  paddingHorizontal: 10,
  borderRadius: 0,
  height: '9%',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'flex-end', 

},
recentlyAddedText: { 
  
    fontFamily: 'Poppins-Regular',
    fontSize: 20,

},
addHelloText: { 
  
  fontFamily: 'Poppins-Regular',
  fontSize: 22,

},

});
export default ScreenFriendFocus;
