import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import ButtonBaseLargeHorScroll from '../components/ButtonBaseLargeHorScroll';
import ButtonBaseSpecialLarge from '../components/ButtonBaseSpecialLarge';
import ButtonBaseSpecialLargeAnim from '../components/ButtonBaseSpecialLargeAnim';
import ButtonBaseSpecialThreeTextAnim from '../components/ButtonBaseSpecialThreeTextAnim';
import ButtonBaseSpecialSelectedAnim from '../components/ButtonBaseSpecialSelectedAnim';

import { BlurView } from 'expo-blur';
import ActionPageUpcomingButton from '../components/ActionPageUpcomingButton'; 
import HelloFriendFooter from '../components/HelloFriendFooter';
import LoadingPage from '../components/LoadingPage';

const ScreenDefaultActionMode = ({ navigation }) => {
  
  const { themeStyles, gradientColors } = useGlobalStyle(); 
  const darkColor = '#4caf50';
  const lightColor ='rgb(160, 241, 67)';
  const { authUserState } = useAuthUser();
  const { selectedFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const { isLoading } = useUpcomingHelloes(); 
  

  const showLastButton = true;

  const [borderColor, setBorderColor] = useState('transparent');
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  // Calculate screen height and button height
  const screenHeight = Dimensions.get('window').height;
  const maxButtonHeight = 100;
  const footerHeight = screenHeight * 0.082; // Footer height
  const buttonContainerHeight = screenHeight - footerHeight; // Remaining height for buttons
  const buttonHeight = buttonContainerHeight / 6; // Divide remaining height by the number of buttons (5 buttons + footer)
  const upcomingDatesTray = buttonHeight * .9;
  const headerHeight = buttonHeight * 1.4;
  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setBorderColor(calculatedThemeColors.lightColor);
      setBackgroundColor(calculatedThemeColors.darkColor);
    } else { 
      setBorderColor('transparent');
      setBackgroundColor('black');
    }
  }, [selectedFriend, loadingNewFriend, calculatedThemeColors]);

  const navigateToAddMomentScreen = () => {
    navigation.navigate('MomentFocus');
  };

  const navigateToAddImageScreen = () => {
    navigation.navigate('AddImage');
  };

  const navigateToAddHelloScreen = () => {
    navigation.navigate('AddHello');
  };

  const navigateToAddFriendScreen = () => {
    navigation.navigate('AddFriend');
  };

  const navigateToAddLocationScreen = () => {
    navigation.navigate('LocationSearch');
  };

  return ( 
    <LinearGradient
      colors={[darkColor, lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, themeStyles.container]}
    >
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill}> 
       
        {authUserState.authenticated && authUserState.user ? (
          <>  
            {isLoading && (  
              <LoadingPage 
                loading={isLoading}
                includeLabel={true}
                label='Updating next helloes'
                spinnerSize={70}
                color='lightgreen'
                spinnerType='wander'
              />  
            )}
            {!isLoading && (  
              <View style={[styles.buttonContainer, {paddingBottom: footerHeight, paddingTop: 10}]}>  
                 

                <ButtonBaseSpecialLargeAnim  onPress={navigateToAddMomentScreen} height={buttonHeight}/>
                <ButtonBaseSpecialLarge label={'ADD IMAGE'} onPress={navigateToAddImageScreen} height={buttonHeight}/>  
                <ButtonBaseSpecialLarge label={'ADD HELLO'} onPress={navigateToAddHelloScreen} image={require("../assets/shapes/coffeecupnoheart.png")} height={buttonHeight}/>
                
                {selectedFriend && showLastButton && (
                  <ButtonBaseSpecialLarge label={'ADD LOCATION'} onPress={navigateToAddLocationScreen} image={require("../assets/shapes/locationpink.png")} height={buttonHeight} />
                
                )}
                {!selectedFriend && showLastButton && ( 
                  <ButtonBaseSpecialLarge label={'ADD FRIEND'} onPress={navigateToAddFriendScreen} image={require("../assets/shapes/yellowleaves.png")} height={buttonHeight} maxHeight={maxButtonHeight}/>
                )} 
                                
                                {!selectedFriend && (
                  
                  <ButtonBaseSpecialThreeTextAnim  onPress={navigateToAddMomentScreen} height={headerHeight} maxHeight={200}/>
                )}
                {selectedFriend && (
                  
                  <ButtonBaseSpecialSelectedAnim  onPress={navigateToAddMomentScreen} height={headerHeight} maxHeight={200}/>
                )} 
                <ButtonBaseLargeHorScroll height={upcomingDatesTray}/> 
                
                <HelloFriendFooter /> 
              </View>
            )}
          </>
        ) : (
          <View style={styles.signInContainer}> 
          </View>
        )} 
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,  
    width: '100%',
    justifyContent: 'space-between',
  },   
  buttonContainer: {   
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between', 
    marginHorizontal: 0,  
    flex: 1,
  }, 
  headerRow: { 
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: '1%',

  },
});

export default ScreenDefaultActionMode;
