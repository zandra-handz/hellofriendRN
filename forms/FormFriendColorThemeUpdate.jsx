import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import ColorPicker, { Panel1, HueSlider } from 'reanimated-color-picker'; // Correct import
import { updateFriendFavesColorTheme } from '../api'; // Import the updateFriendFavesColorTheme function
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';


const FormFriendColorThemeUpdate = forwardRef((props, ref) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendColorTheme, updateFriendColorTheme } = useSelectedFriend();
  const [darkColor, setDarkColor] = useState(friendColorTheme.darkColor || '#000000'); // Default to black
  const [lightColor, setLightColor] = useState(friendColorTheme.lightColor || '#FFFFFF'); // Default to white
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const { updateFriendListColors } = useFriendList();
  const [ isMakingCall, setIsMakingCall ] = useState(false);
  const { themeStyles } = useGlobalStyle();

  const showInHouseSaveButton = false;

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

  const handleSubmit = async () => {
    setIsMakingCall(true);
    try { 
      await updateFriendFavesColorTheme(authUserState.user.id, selectedFriend.id, darkColor, lightColor);
      updateFriendColorTheme({
        darkColor: darkColor, 
        lightColor: lightColor  
      });

      setShowSaveMessage(true);
      //Update friendlist data to show colors even when friend is not selected
      updateFriendListColors(selectedFriend.id, darkColor, lightColor);
      
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
