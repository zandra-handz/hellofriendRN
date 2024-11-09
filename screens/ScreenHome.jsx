import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import ButtonBaseLargeHorScroll from '../components/ButtonBaseLargeHorScroll';
import HomeButtonGenericAdd from '../components/HomeButtonGenericAdd';
import HomeButtonMomentAdd from '../components/HomeButtonMomentAdd';
import HomeButtonUpNext from '../components/HomeButtonUpNext';
import HomeButtonSelectedFriend from '../components/HomeButtonSelectedFriend';

import { BlurView } from 'expo-blur'; 
import HelloFriendFooter from '../components/HelloFriendFooter';
import LoadingPage from '../components/LoadingPage';

const ScreenHome = ({ navigation }) => {
  
  const { themeStyles, gradientColorsHome } = useGlobalStyle(); 
  const { themeAheadOfLoading } = useFriendList();
  const darkColor = '#000002'; // '#4caf50';
  const lightColor ='#163805'; //'rgb(160, 241, 67)';
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendLoaded, loadingNewFriend } = useSelectedFriend();
  const { isLoading } = useUpcomingHelloes(); 
  

  const showLastButton = true;

  const [borderColor, setBorderColor] = useState('transparent');
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  const screenHeight = Dimensions.get('window').height;
  const maxButtonHeight = 100;
  const footerHeight = screenHeight * 0.082; // Footer height
  const buttonContainerHeight = screenHeight - footerHeight; // Remaining height for buttons
  const buttonHeight = buttonContainerHeight / 6; // Divide remaining height by the number of buttons (5 buttons + footer)
  const upcomingDatesTray = buttonHeight * .9;
  const headerHeight = buttonHeight * 1.4;

  

  const buttonDarkColor = '4c8e06';
  const buttonLightColor = '#73d802';

  const topButtonRadius = 40;
  const mainButtonRadius = 40;
  const topButtonBorderColor = 'black';
  const mainButtonBorderColor = 'black';


  useEffect(() => {
    console.log('~~~~~~~~~~~~Main screen rerendered!');

  }, []);
  

  useEffect(() => {
    if (selectedFriend && friendLoaded && !loadingNewFriend) {
      setBorderColor(themeAheadOfLoading.lightColor);
      setBackgroundColor(themeAheadOfLoading.darkColor);
    } else { 
      setBorderColor('transparent');
      setBackgroundColor('black');
    }
  }, [selectedFriend, loadingNewFriend]);

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
      colors={[gradientColorsHome.darkColor, gradientColorsHome.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, themeStyles.container]}
    >
      <BlurView intensity={0} tint="dark" style={StyleSheet.absoluteFill}> 
       
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
                 

                <HomeButtonMomentAdd onPress={navigateToAddMomentScreen} borderRadius={topButtonRadius} borderColor={mainButtonBorderColor} height={buttonHeight} />
                <HomeButtonGenericAdd label={'ADD IMAGE'}  onPress={navigateToAddImageScreen} borderRadius={topButtonRadius} borderColor={topButtonBorderColor} height={buttonHeight}/>  
                <HomeButtonGenericAdd label={'ADD HELLO'} onPress={navigateToAddHelloScreen} borderRadius={topButtonRadius} borderColor={topButtonBorderColor} image={require("../assets/shapes/coffeecupnoheart.png")} height={buttonHeight}/>
                
                {(selectedFriend || friendLoaded) && showLastButton && (
                  <HomeButtonGenericAdd label={'ADD LOCATION'}   onPress={navigateToAddLocationScreen} borderRadius={topButtonRadius} borderColor={topButtonBorderColor} image={require("../assets/shapes/hillylandscape.png")} height={buttonHeight} />
                
                )}
                {(!selectedFriend && !friendLoaded) && showLastButton && ( 
                  <HomeButtonGenericAdd label={'ADD FRIEND'}   onPress={navigateToAddFriendScreen} borderRadius={topButtonRadius} borderColor={topButtonBorderColor} image={require("../assets/shapes/yellowleaves.png")} height={buttonHeight} maxHeight={maxButtonHeight}/>
                )} 
                                
                {!selectedFriend && (
                  
                  <HomeButtonUpNext  onPress={navigateToAddMomentScreen}   borderRadius={mainButtonRadius} height={headerHeight} borderColor={mainButtonBorderColor} maxHeight={200}/>
                )}
                {selectedFriend && (
                  
                  <HomeButtonSelectedFriend  onPress={navigateToAddMomentScreen} borderRadius={mainButtonRadius} borderColor={mainButtonBorderColor} height={headerHeight} maxHeight={200}/>
                )} 
                <ButtonBaseLargeHorScroll height={upcomingDatesTray}   borderRadius={mainButtonRadius} borderColor={mainButtonBorderColor}/> 
                
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

export default ScreenHome;
