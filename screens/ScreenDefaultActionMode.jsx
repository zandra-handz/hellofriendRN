import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import ButtonBaseLargeHorScroll from '../components/ButtonBaseLargeHorScroll';
import ButtonBaseSpecialLarge from '../components/ButtonBaseSpecialLarge';
import ButtonBaseSpecialLargeAnim from '../components/ButtonBaseSpecialLargeAnim';

import ActionPageUpcomingButton from '../components/ActionPageUpcomingButton'; 
import HelloFriendFooter from '../components/HelloFriendFooter';
import LoadingPage from '../components/LoadingPage';

const ScreenDefaultActionMode = ({ navigation }) => {
  
  const { themeStyles } = useGlobalStyle(); 
  const { authUserState } = useAuthUser();
  const { selectedFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const { isLoading } = useUpcomingHelloes(); 

  const showLastButton = false;

  const [borderColor, setBorderColor] = useState('transparent');
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  // Calculate screen height and button height
  const screenHeight = Dimensions.get('window').height;
  const footerHeight = screenHeight * 0.078; // Footer height
  const buttonContainerHeight = screenHeight - footerHeight; // Remaining height for buttons
  const buttonHeight = buttonContainerHeight / 6; // Divide remaining height by the number of buttons (5 buttons + footer)

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
    <View 
      style={[styles.selectorContainer, 
        selectedFriend && !loadingNewFriend 
        ? { backgroundColor: backgroundColor } 
        : {}
      ]}
    >
      <View style={[styles.container, themeStyles.container]}>
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
                <ActionPageUpcomingButton height={buttonHeight}/> 
                <ButtonBaseLargeHorScroll height={buttonHeight}/> 
                
                <ButtonBaseSpecialLargeAnim  onPress={navigateToAddMomentScreen} height={buttonHeight}/>
                <ButtonBaseSpecialLarge onPress={navigateToAddImageScreen} height={buttonHeight}/>  
                <ButtonBaseSpecialLarge label={'ADD HELLO'} onPress={navigateToAddHelloScreen} image={require("../assets/shapes/coffeecupnoheart.png")} height={buttonHeight}/>
                {selectedFriend && showLastButton && (
                  <ButtonBaseSpecialLarge label={'ADD LOCATION'} onPress={navigateToAddLocationScreen} height={buttonHeight} />
                )}
                {!selectedFriend && showLastButton && ( 
                  <ButtonBaseSpecialLarge label={'ADD FRIEND'} onPress={navigateToAddFriendScreen} height={buttonHeight}/>
                )} 
                <HelloFriendFooter /> 
              </View>
            )}
          </>
        ) : (
          <View style={styles.signInContainer}> 
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flex: 1,
  },
  container: {
    flex: 1,  
    justifyContent: 'space-between',
  },   
  buttonContainer: {   
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 4,  
  }, 
});

export default ScreenDefaultActionMode;
