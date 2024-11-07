import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import ColorPicker, { Panel1, HueSlider } from 'reanimated-color-picker'; // Correct import
import { updateFriendFavesColorTheme } from '../api'; // Import the updateFriendFavesColorTheme function
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import tinycolor from 'tinycolor2';


const FormFriendColorThemeUpdate = forwardRef((props, ref) => {
  const { authUserState } = useAuthUser();
  const { updateFriendListColors, themeAheadOfLoading, setThemeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendColorTheme, updateFriendColorTheme } = useSelectedFriend();
  const [darkColor, setDarkColor] = useState(themeAheadOfLoading.darkColor || '#000000'); // Default to black
  const [lightColor, setLightColor] = useState(themeAheadOfLoading.lightColor || '#FFFFFF'); // Default to white
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const [ isMakingCall, setIsMakingCall ] = useState(false);
  const { themeStyles } = useGlobalStyle();

  const showInHouseSaveButton = false;


  
  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;  
   
    if (!tinycolor.isReadable(baseColor, targetColor, { level: 'AA', size: 'small' })) {
       fontColor = isInverted ? '#ffffff' : '#000000';
  
      if (!tinycolor.isReadable(baseColor, fontColor, { level: 'AA', size: 'small' })) {
        // If not readable, switch to the opposite color
        fontColor = fontColor === '#ffffff' ? '#000000' : '#ffffff';
      }
    }
  
    return fontColor; // Return the determined font color
  };

  const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor; // Start with the base color
  
    // Check if the targetColor is readable on the baseColor
    if (!tinycolor.isReadable(targetColor, baseColor, { level: 'AA', size: 'small' })) {
      // If not readable, switch to black or white based on isInverted
      fontColorSecondary = isInverted ? '#000000' : '#ffffff';
  
      if (!tinycolor.isReadable(targetColor, fontColorSecondary, { level: 'AA', size: 'small' })) {
        // If not readable, switch to the opposite color
        fontColorSecondary = fontColorSecondary === '#000000' ? '#ffffff' : '#000000';
      }
    } 
  
    return fontColorSecondary; // Return the determined secondary font color
  };

  useEffect(() => {
    if (friendColorTheme) {
      setDarkColor(friendColorTheme.darkColor || '#000000');
      setLightColor(friendColorTheme.lightColor || '#FFFFFF');
    }
  }, [friendColorTheme]);

  useEffect(() => { 
    if (props.onMakingCallChange) {
      props.onMakingCallChange(isMakingCall);
    }
  }, [isMakingCall, props]);
 
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));


  const handleSwapColors = () => {
    const newLightColor = darkColor;
    const newDarkColor = lightColor;
    setDarkColor(newDarkColor);
    setLightColor(newLightColor);
  };

  const handleSubmit = async () => {
    setIsMakingCall(true);

    const fontColor = getFontColor(darkColor, lightColor, false);
    const fontColorSecondary = getFontColorSecondary(darkColor, lightColor, false);
 

    try { 
      await updateFriendFavesColorTheme(authUserState.user.id, selectedFriend.id, darkColor, lightColor, fontColor, fontColorSecondary);
      //selectedFriend function, should remove eventually
      updateFriendColorTheme({
        darkColor: darkColor, 
        lightColor: lightColor, 
        fontColor: fontColor,
        fontColorSecondary: fontColorSecondary
      });

      //this one updates the friendList data for this friend
   

      setShowSaveMessage(true); 
      updateFriendListColors(selectedFriend.id, darkColor, lightColor, fontColor, fontColorSecondary);
      
      //updateFriendListColors also sets themeAheadOfLoading
      //setThemeAheadOfLoading({
      //  lightColor: lightColor, 
      //  darkColor: darkColor, 
      //  fontColor: fontColor, 
      //  fontColorSecondary: fontColorSecondary,
   // });
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
      setIsMakingCall(false);
    } catch (error) {
      console.error('Error updating friend color theme:', error);
    }
    setIsMakingCall(false); 
  };
  const onSelectLightColor = (color) => {
    const hexColor = color.hex.slice(0, 7);  
      setLightColor(hexColor); 
  };

  const onSelectDarkColor = (color) => {
    const hexColor = color.hex.slice(0, 7); 
      setDarkColor(hexColor);
  
  };

  return (
    <View style={styles.container}>
      {showSaveMessage && <Text style={styles.saveMessage}>Color theme updated successfully!</Text>}
     
      <View style={{width: '100%'}}>
        <View style={styles.inputContainer}>
          <Text style={[styles.colorValue, themeStyles.subHeaderText]}>Dark Color: </Text>
          <TouchableOpacity onPress={() => {}}>
          <View style={[styles.colorBlock, { backgroundColor: darkColor, borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor }]} />
          </TouchableOpacity>
        </View> 
        <View style={styles.pickerContainer}>
          <ColorPicker style={{ width: '100%' }} value={darkColor} onComplete={onSelectDarkColor}>
            
          <Panel1  style={{borderRadius: 20, borderWidth: 1, borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor}}/>
          <HueSlider  style={{borderRadius: 20, paddingTop: 6, borderWidth: 1, borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor}}/> 
          </ColorPicker>
        </View>
      </View>
      <TouchableOpacity style={styles.swapButtonContainer} onPress={handleSwapColors}>
        <Text style={styles.swapButtonText}>SWAP</Text>
      </TouchableOpacity>

      <View style={{width: '100%'}}>
        <View style={styles.inputContainer}>
          <Text style={[styles.colorValue, themeStyles.subHeaderText]}>Light Color: </Text>
          <TouchableOpacity onPress={() => {}}>
            <View style={[styles.colorBlock, { backgroundColor: lightColor,  borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor }]} />
          </TouchableOpacity>
        </View>
        <View style={styles.pickerContainer}>
        <ColorPicker style={{ width: '100%' }} value={lightColor} onComplete={onSelectLightColor}>
            <Panel1  style={{borderRadius: 20, borderWidth: 1, borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor}}/>
            <HueSlider  style={{borderRadius: 20, paddingTop: 6, borderWidth: 1, borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor}}/> 
          </ColorPicker>
        </View>
      </View>

      {showInHouseSaveButton && (
        
      <Button title="Save Colors" onPress={handleSubmit} />
      )} 
    </View>
  );
});

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'space-between', 
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    padding: 0,
  },
  saveMessage: {
    color: 'green', 
  },
  swapButtonContainer: {
    width: '100%',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

  },
  swapButtonText: {
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  inputContainer: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    width: '100%',  
    alignItems: 'center', 
    paddingVertical: 6,
  },
  colorValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
  },
  colorBlock: {
    height: 40,  
    width: 240,
    borderRadius: 20, 
    borderWidth: 1,  
  },
});

export default FormFriendColorThemeUpdate;
