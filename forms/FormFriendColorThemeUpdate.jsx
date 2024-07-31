import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Button, StyleSheet, Text, Modal } from 'react-native';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker'; // Correct import
import { updateFriendFavesColorTheme } from '../api'; // Import the updateFriendFavesColorTheme function
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const FormFriendColorThemeUpdate = forwardRef((props, ref) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendColorTheme, updateFriendColorTheme } = useSelectedFriend();
  const [darkColor, setDarkColor] = useState('#000000'); // Default to black
  const [lightColor, setLightColor] = useState('#FFFFFF'); // Default to white
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState(null); // 'dark' or 'light'

  // Initialize color states based on friendColorTheme
  useEffect(() => {
    if (friendColorTheme) {
      setDarkColor(friendColorTheme.darkColor || '#000000');
      setLightColor(friendColorTheme.lightColor || '#FFFFFF');
    }
  }, [friendColorTheme]);

  // Expose submit method
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const handleSubmit = async () => {
    try {
      // Call the API with user ID and friend ID, and new color values
      await updateFriendFavesColorTheme(authUserState.user.id, selectedFriend.id, darkColor, lightColor);

      // Reset color theme to previous or default values (excluding useFriendColorTheme)
      updateFriendColorTheme({
        darkColor: darkColor, // or use the previous color if you have it stored
        lightColor: lightColor // or use the previous color if you have it stored
      });

      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating friend color theme:', error);
    }
  };
  const onSelectColor = (color) => {
    const hexColor = color.hex.slice(0, 7); // Get only the 6 digits (RGB) part
    if (colorPickerType === 'dark') {
      setDarkColor(hexColor);
    } else if (colorPickerType === 'light') {
      setLightColor(hexColor);
    }
    setShowColorPicker(false);
  };

  return (
    <View style={styles.container}>
      {showSaveMessage && <Text style={styles.saveMessage}>Color theme updated successfully!</Text>}
      
      <View style={styles.inputContainer}>
        <Button title="Select Dark Color" onPress={() => { setColorPickerType('dark'); setShowColorPicker(true); }} />
        <Text style={styles.colorValue}>Dark Color: {darkColor}</Text>
        <View style={[styles.colorBlock, { backgroundColor: darkColor }]} />
      </View>

      <View style={styles.inputContainer}>
        <Button title="Select Light Color" onPress={() => { setColorPickerType('light'); setShowColorPicker(true); }} />
        <Text style={styles.colorValue}>Light Color: {lightColor}</Text>
        <View style={[styles.colorBlock, { backgroundColor: lightColor }]} />
      </View>

      <Button title="Save Colors" onPress={handleSubmit} />

      <Modal visible={showColorPicker} animationType="slide">
        <ColorPicker style={{ width: '70%' }} value={colorPickerType === 'dark' ? darkColor : lightColor} onComplete={onSelectColor}>
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
          <Swatches />
        </ColorPicker>
        <Button title="Close" onPress={() => setShowColorPicker(false)} />
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'center', 
    width: '100%',
    padding: 20,
  },
  saveMessage: {
    color: 'green',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  colorValue: {
    fontSize: 16,
    marginTop: 10,
  },
  colorBlock: {
    height: 50,
    width: '100%',
    marginTop: 10,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default FormFriendColorThemeUpdate;
