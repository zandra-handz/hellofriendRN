
//<Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
//{selectedFriend ? selectedFriend.name : ''}
//</Text>
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import LastHelloBanner from '../components/LastHelloBanner';
import ActionFriendPageMoments from '../components/ActionFriendPageMoments'; // Import the new component
import ComposerFriendImages from '../components/ComposerFriendImages'; // Import the new component
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 import LoadingPage from '../components/LoadingPage';
import { Dimensions } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter'; 
 
import ButtonBaseSpecialFriendFocus from '../components/ButtonBaseSpecialFriendFocus';
 
import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';
 import LocationHeartOutlineSvg from '../assets/svgs/location-heart-outline';
import PhotoSolidSvg from '../assets/svgs/photo-solid';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline';


const ScreenFriendFocus = () => {
  const { selectedFriend, friendDashboardData, friendColorTheme, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle(); 

  useFocusEffect(
    React.useCallback(() => {
      setIsAnimationPaused(false);
    }, [])
  );


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

const calculatedDarkColor = friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50';
const calculatedLightColor = friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)';
const [isAnimationPaused, setIsAnimationPaused ] = useState(true);
  
  useEffect(() => {
    const handleScreenBlur = () => {
      setIsAnimationPaused(true);
      console.log('paused animation via blur effect');
    };

    const unsubscribeBlur = navigation.addListener('blur', handleScreenBlur);

    return unsubscribeBlur;
  }, [navigation]);


const navigateToMomentsScreen = () => { 
    navigation.navigate('Moments'); 
  };

  const navigateToHelloesScreen = () => { 
    navigation.navigate('Helloes'); 
  };

  const navigateToImagesScreen = () => { 
    navigation.navigate('Images'); 
  };

  const navigateToLocationsScreen = () => { 
    navigation.navigate('Locations'); 
  };


  return (
    <LinearGradient
      colors={[friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)']}  
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}  
      style={styles.container} 
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

            <View style={{flexDirection: 'column', paddingHorizontal: 10, justifyContent: 'flex-start',  width: '100%'}}>
               <>
                <Text
                  style={[styles.headerText, themeStyles.subHeaderText, { color: calculatedThemeColors.fontColor }]}
                  numberOfLines={2} // Allows a maximum of 2 lines (you can adjust this value as needed)
                  ellipsizeMode="tail" // Adds "..." if the text is too long
                >
                  Say hi on {friendDashboardData ? `${friendDashboardData[0].future_date_in_words}!` : ' '}
                </Text> 
                
               </>
            </View>    
          </View>

          <View style={[styles.bottomSectionContainer, {paddingBottom: bottomSectionPadding}]}>  
 
          
            <View style={[styles.backColorContainer, themeStyles.genericTextBackground, {borderColor: themeAheadOfLoading.lightColor}]}>
      
            <View style={{ marginHorizontal: buttonMargin,  zIndex: 4, top: '0%', height: '16%',  width: '100%' }}>
                
                <LastHelloBanner />  
                  
                </View>  
                                   
            <ButtonBaseSpecialFriendFocus
            label='SEND A LOCAL'
            image={LocationHeartOutlineSvg }
            imageSize={80}
            labelSize={19}
            isDisabled={false}
            darkColor={calculatedDarkColor}
            lightColor={calculatedLightColor}
            imagePositionHorizontal={0} 
            imagePositionVertical={6}
            borderRadius={50}
            onPress={navigateToLocationsScreen}
            /> 
            <ButtonBaseSpecialFriendFocus
            label='SEND AN IMAGE'
            image={PhotoSolidSvg }
            imageSize={80}
            labelSize={19}
            isDisabled={false}
            darkColor={calculatedDarkColor}
            lightColor={calculatedLightColor}
            imagePositionHorizontal={0} 
            imagePositionVertical={6}
            borderRadius={50}
            onPress={navigateToImagesScreen}
            /> 
            <View style={{marginTop: '4%'}}>
               <ComposerFriendImages 
                topIconSize={topIconSize} 
                bottomIconSize={bottomIconSize} 
                buttonHeight={'auto'} 
                headerHeight={'auto'}
                buttonRadius={radius} 
                includeHeader={false}
                headerInside={true}
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={'transparent'} 
              />
              </View>
                          <ButtonBaseSpecialFriendFocus
            label='REVIEW MOMENTS'
            image={ThoughtBubbleOutlineSvg }
            imageSize={80}
            labelSize={19}
            isDisabled={false}
            darkColor={calculatedDarkColor}
            lightColor={calculatedLightColor}
            imagePositionHorizontal={0} 
            imagePositionVertical={6}
            borderRadius={50}
            onPress={navigateToMomentsScreen}
            />  



            
            <View style={{ marginTop: 0, borderTopWidth: 0, borderColor: themeStyles.genericText.color, marginHorizontal: buttonMargin }}>
              <ActionFriendPageMoments 
                topIconSize={topIconSize} 
                bottomIconSize={momentsBottomIconSize} 
                buttonHeight={176} 
                buttonRadius={radius} 
                inactiveIconColor={inactiveIconColor} 
                oneBackgroundColor={oneBackgroundColor}
                headerHeight={24} 
                includeHeader={false} 
                headerInside={true} 
                headerText={''} 
                animationPaused={isAnimationPaused}
                onAddMomentPress={navigateToMomentsScreen}
              /> 
            </View> 
            <ButtonBaseSpecialFriendFocus
            label='HELLOES HISTORY'
            image={PhoneChatMessageHeartSvg }
            imageSize={100}
            labelSize={19}
            isDisabled={false}
            darkColor={calculatedDarkColor}
            lightColor={calculatedLightColor}
            imagePositionHorizontal={0} 
            imagePositionVertical={12}
            borderRadius={50}
            onPress={navigateToHelloesScreen}
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
    marginTop: 0,
    fontFamily: 'Poppins-Regular',

  },
  topSectionContainer: {
    width: '100%',  
    flex: 1,
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
backColorContainer: {  
  minHeight: '92%', 
  alignContent: 'center',
  paddingHorizontal: '2%',
  paddingTop: '0%',
  paddingBottom: '13%', 
  width: '101%',
  alignSelf: 'center',
  borderWidth: 1,
  borderTopRightRadius: 30,
  borderTopLeftRadius: 30,
  borderRadius: 30,
  flexDirection: 'column',
  justifyContent: 'space-between',
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
