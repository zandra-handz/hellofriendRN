//  <BaseRowModalFooter 
// iconName='palette' 
// iconSize={20}
// label='Invert gradient' 
// useToggle={true}
// value={invertGradientDirection}
// onTogglePress={toggleColorThemeGradientDirection}
// /> 

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import {
  updateFriendFavesColorThemeSetting,
  resetFriendFavesColorThemeToDefault,
  updateFriendFavesColorThemeGradientDirection,
} from '../api'; 
 

import FriendSettingsSection from '../components/FriendSettingsSection';
import ModalFormColorTheme from '../components/ModalFormColorTheme';
import LoadingPage from '../components/LoadingPage'; 
import BaseRowModalFooter from '../components/BaseRowModalFooter';
import tinycolor from 'tinycolor2';

const ModalColorTheme = () => {
  const { authUserState } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const { friendList, updateFriendListColors, setThemeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendColorTheme, setFriendColorTheme } = useSelectedFriend();
  const [isColorThemeModalVisible, setIsColorThemeModalVisible] = useState(false);
  const [isMakingCall, setIsMakingCall] = useState(false);
  const formRef = useRef(null);
  const [useFriendColorTheme, setUseFriendColorTheme] = useState(false);
  const [isColorThemeOn, setIsColorThemeOn] = useState(false);
  const [invertGradientDirection, setInvertGradientDirection] = useState(false);

 

  const getSavedColorTheme = () => {
    const currentFriend = friendList.find(friend => friend.id === selectedFriend.id);
    return {savedDarkColor: currentFriend.savedDarkColor, savedLightColor: currentFriend.savedLightColor};

  };

  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;  
   
    if (!tinycolor.isReadable(baseColor, targetColor, { level: 'AA', size: 'small' })) {
       fontColor = isInverted ? 'white' : 'black';
  
      if (!tinycolor.isReadable(baseColor, fontColor, { level: 'AA', size: 'small' })) {
        // If not readable, switch to the opposite color
        fontColor = fontColor === 'white' ? 'black' : 'white';
      }
    }
  
    return fontColor; // Return the determined font color
  };

  const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor; // Start with the base color
  
    if (!tinycolor.isReadable(targetColor, baseColor, { level: 'AA', size: 'small' })) {
      fontColorSecondary = isInverted ? 'black' : 'white';
  
      if (!tinycolor.isReadable(targetColor, fontColorSecondary, { level: 'AA', size: 'small' })) {
       
        fontColorSecondary = fontColorSecondary === 'black' ? 'white' : 'black';
      }
    }
  
    return fontColorSecondary; // Return the determined secondary font color
  };
  

  useEffect(() => {
    if (friendColorTheme) {
      setUseFriendColorTheme(friendColorTheme.useFriendColorTheme || false);
      setIsColorThemeOn(friendColorTheme.useFriendColorTheme || false);
      setInvertGradientDirection(friendColorTheme.invertGradient || false);
    }
  }, [friendColorTheme]);

  const toggleUseFriendColorTheme = async () => {
    const newValue = !useFriendColorTheme;
    setUseFriendColorTheme(newValue);
    await updateColorThemeSetting(newValue);
  };
 

  const updateColorThemeSetting = async (setting) => {
    setIsMakingCall(true);

    if (useFriendColorTheme) {
      try {
        await resetFriendFavesColorThemeToDefault(
          authUserState.user.id,selectedFriend.id, 
          setting,
          //To make this reset, this api call also sets use_friend_color_theme to false
        );

        //This also includes setThemeAheadOfLoading
        updateFriendListColors(
          selectedFriend.id, '#4caf50', '#a0f143', '#000000', '#000000');
 
        //setThemeAheadOfLoading({lightColor: '#a0f143', darkColor: '#4caf50', fontColor: 'black', secondaryFontColor: 'black'});
  
        setFriendColorTheme((prev) => ({ ...prev, useFriendColorTheme: setting }));
    
      } finally {
        setIsMakingCall(false);
      }

    } else {
      try {
        const response = getSavedColorTheme();
        const fontColor = getFontColor(
          response.savedDarkColor, 
          response.savedLightColor, 
          false);
        const fontColorSecondary = getFontColorSecondary(
          
            response.savedDarkColor, 
            response.savedLightColor, 
            false);
        
        console.log(response);
        await updateFriendFavesColorThemeSetting(authUserState.user.id, selectedFriend.id, response.savedDarkColor, response.savedLightColor);
        
        //This also includes setThemeAheadOfLoading
        updateFriendListColors(selectedFriend.id, response.savedDarkColor, response.savedLightColor, fontColor, fontColorSecondary);
     
        setFriendColorTheme((prev) => ({ ...prev, useFriendColorTheme: setting }));
      
      } finally {
        setIsMakingCall(false); 
      } 
  };
  };
 
 
  const closeColorThemeModal = () => setIsColorThemeModalVisible(false);

  const toggleColorThemeModal = () => setIsColorThemeModalVisible(true);

  return ( 
      <View style={styles.container}>

    <FriendSettingsSection  
      isMakingCall={isMakingCall}
      LoadingComponent={LoadingPage} 
    >

      {isColorThemeOn && (
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
      )}
          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label={isColorThemeOn ? 'Turn off' : 'Turn on'}
            useToggle={true}
            value={useFriendColorTheme}
            onTogglePress={toggleUseFriendColorTheme} 
          /> 


      <ModalFormColorTheme
        isVisible={isColorThemeModalVisible} 
        formRef={formRef}
        close={closeColorThemeModal} 
      />
    </FriendSettingsSection> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
