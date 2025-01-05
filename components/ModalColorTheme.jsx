import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext'; 
import {
  updateFriendFavesColorThemeSetting,
  resetFriendFavesColorThemeToDefault, 
} from '../api'; 
 

import FriendSettingsSection from '../components/FriendSettingsSection';
import ModalFormColorTheme from '../components/ModalFormColorTheme';
import LoadingPage from '../components/LoadingPage'; 
import BaseRowModalFooter from '../components/BaseRowModalFooter';
import tinycolor from 'tinycolor2';

const ModalColorTheme = ({isModalVisible, closeModal}) => {
  const { authUserState } = useAuthUser(); 
  const { friendList, updateFriendListColorsExcludeSaved } = useFriendList();
  const { selectedFriend, friendColorTheme, setFriendColorTheme } = useSelectedFriend();
  
  const [isMakingCall, setIsMakingCall] = useState(false);
  const formRef = useRef(null);
  const [useFriendColorTheme, setUseFriendColorTheme] = useState(false);
  const [isColorThemeOn, setIsColorThemeOn] = useState(false);


  const getSavedColorTheme = () => {
    const currentFriend = friendList.find(friend => friend.id === selectedFriend.id);
    return {savedDarkColor: currentFriend.savedDarkColor, savedLightColor: currentFriend.savedLightColor};

  };

  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;  
   
    if (!tinycolor.isReadable(baseColor, targetColor, { level: 'AA', size: 'small' })) {
       fontColor = isInverted ? 'white' : 'black';
  
      if (!tinycolor.isReadable(baseColor, fontColor, { level: 'AA', size: 'small' })) {
        fontColor = fontColor === 'white' ? 'black' : 'white';
      }
    }
  
    return fontColor;
  };

  const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor;
  
    if (!tinycolor.isReadable(targetColor, baseColor, { level: 'AA', size: 'small' })) {
      fontColorSecondary = isInverted ? 'black' : 'white';
  
      if (!tinycolor.isReadable(targetColor, fontColorSecondary, { level: 'AA', size: 'small' })) {
       
        fontColorSecondary = fontColorSecondary === 'black' ? 'white' : 'black';
      }
    }
  
    return fontColorSecondary; 
  };
  

  useEffect(() => {
    if (friendColorTheme) {
      setUseFriendColorTheme(friendColorTheme.useFriendColorTheme || false);
      setIsColorThemeOn(friendColorTheme.useFriendColorTheme || false);
    }
  }, [friendColorTheme]);

  const toggleUseFriendColorTheme = async () => {
    const newValue = !useFriendColorTheme;
    setUseFriendColorTheme(newValue);
    await updateColorThemeSetting(newValue);
  };
 

  const updateColorThemeSetting = async (setting) => {
    setIsMakingCall(true);

    if (useFriendColorTheme) { // if state before toggling Color Theme is off
      try {
        await resetFriendFavesColorThemeToDefault(
          authUserState.user.id,selectedFriend.id, 
          setting,
          //To make this reset, this api call also sets use_friend_color_theme to false
        );

        //This also includes setThemeAheadOfLoading
        updateFriendListColorsExcludeSaved(
          selectedFriend.id, '#4caf50', '#a0f143', '#000000', '#000000');
 
        //setThemeAheadOfLoading({lightColor: '#a0f143', darkColor: '#4caf50', fontColor: 'black', secondaryFontColor: 'black'});
  
        setFriendColorTheme((prev) => ({ ...prev, useFriendColorTheme: setting }));
    
      } finally {
        setIsMakingCall(false);
      }

    } else {
      try {
        const response = getSavedColorTheme();
        console.log('getSavedColorTheme response: ', response);
        const fontColor = getFontColor(
          response.savedDarkColor, 
          response.savedLightColor, 
          false);
        const fontColorSecondary = getFontColorSecondary(
          
            response.savedDarkColor, 
            response.savedLightColor, 
            false);
        
        console.log(response);
        await updateFriendFavesColorThemeSetting(authUserState.user.id, selectedFriend.id, response.savedDarkColor, response.savedLightColor, fontColor, fontColorSecondary);
        
        //This also includes setThemeAheadOfLoading
        updateFriendListColorsExcludeSaved(selectedFriend.id, response.savedDarkColor, response.savedLightColor, fontColor, fontColorSecondary);
     
        setFriendColorTheme((prev) => ({ ...prev, useFriendColorTheme: setting }));
      
      } finally {
        setIsMakingCall(false); 
      } 
  };
  };
  

  return ( 
      <View style={styles.container}>

    <FriendSettingsSection  
      isMakingCall={isMakingCall}
      LoadingComponent={LoadingPage} 
    >

      {/* {isColorThemeOn && (
        <>

          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label='Color Theme' 
            useToggle={false}
            useCustom={true}
            customLabel={'Change'}
            onCustomPress={toggleColorThemeModal} 
          />  

        </>
      )} */}
          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label={isColorThemeOn ? 'Turn off' : 'Turn on'}
            useToggle={true}
            value={useFriendColorTheme}
            onTogglePress={toggleUseFriendColorTheme} 
          /> 


      <ModalFormColorTheme
        isVisible={isModalVisible} 
        formRef={formRef}
        close={closeModal} 
      />
    </FriendSettingsSection> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: '100%',

  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 
  },
    
  headerIcon: { 
    marginRight: 10 
  },
  modalTitle: { 
    fontSize: 17, 
    fontFamily: 'Poppins-Bold',
    width: '80%',
  },
 

});

export default ModalColorTheme;
