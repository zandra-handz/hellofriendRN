import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import ActionScreenButtonAddMoment from '../components/ActionScreenButtonAddMoment';
import ActionScreenButtonAddImage from '../components/ActionScreenButtonAddImage';
import ActionScreenButtonAddHello from '../components/ActionScreenButtonAddHello';
import ActionScreenButtonAddFriend from '../components/ActionScreenButtonAddFriend';
import ActionScreenButtonAddLocation from '../components/ActionScreenButtonAddLocation';


import ActionPageUpcomingButton from '../components/ActionPageUpcomingButton'; 
import HelloFriendFooter from '../components/HelloFriendFooter';


import LoadingPage from '../components/LoadingPage';

const ScreenDefaultActionMode = ({ navigation, mainAppButton=false }) => {
  
  const { themeStyles } = useGlobalStyle(); 

  const { authUserState } = useAuthUser();
  const { selectedFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const { isLoading } = useUpcomingHelloes(); 
  const [ borderColor, setBorderColor ] = useState('transparent');
  const [ backgroundColor, setBackgroundColor ] = useState('transparent');


  const borderWidth = 0;
  const borderRadius = 34;

  const buttonHeight = 130;
  const headerHeight = 150;

  const paddingAboveTopButton = 10;

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setBorderColor(calculatedThemeColors.lightColor);
      setBackgroundColor(calculatedThemeColors.darkColor);
    } else { 
      setBorderColor('transparent');
      setBackgroundColor('black');
    }
    

  }, [selectedFriend, loadingNewFriend, calculatedThemeColors])

   


  const navigateToAddMomentScreen = () => {
    navigation.navigate('AddMoment');
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

  const navigateSignInScreen = () => {
    navigation.navigate('Signin');
  };

return ( 
  <View 
  style={[
    styles.selectorContainer, 
    selectedFriend && !loadingNewFriend 
      ? { backgroundColor: backgroundColor } 
      : {}
  ]}
>
    <View 
      style={[
        styles.container, 
        themeStyles.container, 
      ]}
    >
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
            <>
            <View style={[styles.buttonContainer, {paddingTop: paddingAboveTopButton}]}>  
              <ActionPageUpcomingButton height={headerHeight}/> 
              <ActionScreenButtonAddMoment onPress={navigateToAddMomentScreen} height={buttonHeight}/>

              <ActionScreenButtonAddImage onPress={navigateToAddImageScreen} height={buttonHeight}/>
 
              <ActionScreenButtonAddHello onPress={navigateToAddHelloScreen} height={buttonHeight}/>
          
              {selectedFriend && (
                <ActionScreenButtonAddLocation onPress={navigateToAddLocationScreen} height={buttonHeight} />
               )}
              {!selectedFriend && ( 
                <ActionScreenButtonAddFriend onPress={navigateToAddFriendScreen} height={buttonHeight}/>
      
               )} 
                <HelloFriendFooter /> 
                </View>
          </>
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
    justifyContent: 'space-between',
    marginHorizontal: 4,

    paddingBottom: 0,  
  },
  footerContainer: {
    position: 'absolute',
    width: '100%', 
    bottom: 0,

  },
});

export default ScreenDefaultActionMode;
