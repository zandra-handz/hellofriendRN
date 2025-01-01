import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

import { useCurrentLocationManual, useGeolocationWatcher } from '../hooks/useCurrentLocationAndWatcher';

import { useAuthUser } from '../context/AuthUserContext'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import HomeScrollSoon from '../components/HomeScrollSoon';
import HomeButtonGenericAdd from '../components/HomeButtonGenericAdd';
import HomeButtonMomentAdd from '../components/HomeButtonMomentAdd';
import HomeButtonUpNext from '../components/HomeButtonUpNext';
import HomeButtonSelectedFriend from '../components/HomeButtonSelectedFriend';
import useCurrentLocation from '../hooks/useCurrentLocation';

import { BlurView } from 'expo-blur'; 
import HelloFriendFooter from '../components/HelloFriendFooter'; 

const ScreenHomeOldDesign = ({ navigation }) => {
   useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles, gradientColorsHome } = useGlobalStyle();  
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendLoaded } = useSelectedFriend();
  const { isLoading } = useUpcomingHelloes(); 
  
  const { data, isLoadingCurrentLocation, error } = useCurrentLocationManual();

  const showLastButton = true; 
  const screenHeight = Dimensions.get('window').height;
  const maxButtonHeight = 100;
  const footerHeight = screenHeight * 0.082; // Footer height
  const buttonContainerHeight = screenHeight - footerHeight; // Remaining height for buttons
  const buttonHeight = buttonContainerHeight / 6; // Divide remaining height by the number of buttons (5 buttons + footer)
  const upcomingDatesTray = buttonHeight * .9;
  const headerHeight = buttonHeight * 1.4;

  const {currentLocationDetails, currentRegion }= useCurrentLocation();
  useEffect(() => {
    if (currentLocationDetails) {
      console.log('data in home screen', currentLocationDetails);
      
    }
  
  }, [currentLocationDetails]);

  // Animated values for slide-in effect
  const [slideAnim] = useState(new Animated.Value(1));  // Value for animating the button container

  // Trigger the slide-in animation when the screen mounts
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide in from the right
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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
              <Animated.View style={[styles.buttonContainer, {paddingBottom: footerHeight, paddingTop: 10, transform: [{ translateX: slideAnim }]}]}>
                 {/* <View style={{flex: 1}}>  */}
                <HomeButtonMomentAdd onPress={navigateToAddMomentScreen} borderRadius={40} borderColor="black" height={buttonHeight} />
                <HomeButtonGenericAdd label={'ADD IMAGE'}  onPress={navigateToAddImageScreen} borderRadius={40} borderColor="black" height={buttonHeight}/>  
                <HomeButtonGenericAdd label={'ADD HELLO'} onPress={navigateToAddHelloScreen} borderRadius={40} borderColor="black" image={require("../assets/shapes/coffeecupnoheart.png")} height={buttonHeight}/>
                
                {(selectedFriend || friendLoaded) && showLastButton && (
                  <HomeButtonGenericAdd label={'ADD MEETUP SPOT'}   onPress={navigateToAddLocationScreen} borderRadius={40} borderColor="black" image={require("../assets/shapes/hillylandscape.png")} height={buttonHeight} />
                )}
                {(!selectedFriend && !friendLoaded) && showLastButton && ( 
                  <HomeButtonGenericAdd label={'ADD FRIEND'}   onPress={navigateToAddFriendScreen} borderRadius={40} borderColor="black" image={require("../assets/shapes/yellowleaves.png")} height={buttonHeight} maxHeight={maxButtonHeight}/>
                )} 
                {/* </View> */}
                {!selectedFriend && (
                  <HomeButtonUpNext  onPress={navigateToAddMomentScreen} borderRadius={40} height={headerHeight} borderColor="black" maxHeight={200}/>
                )}
                {selectedFriend && (
                  <HomeButtonSelectedFriend  onPress={navigateToAddMomentScreen} borderRadius={40} borderColor="black" height={headerHeight} maxHeight={200}/>
                )}
                <HomeScrollSoon height={upcomingDatesTray} borderRadius={40} borderColor="black"/> 
                
                <HelloFriendFooter /> 
              </Animated.View> 
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
  loadingWrapper: {
    flex: 1,
    width: '100%', 
  },
});

export default ScreenHomeOldDesign;
