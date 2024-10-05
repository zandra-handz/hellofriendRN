import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; // Adjust the import path as necessary
import tinycolor from 'tinycolor2';

const PhoneStatusBar = () => {
const { theme, themeStyles , nonCustomHeaderPage, setNonCustomHeaderPage} = useGlobalStyle();
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend();
  const [ color, setColor ] = useState('');


  useEffect(() => {
    console.log('theme colors updated', calculatedThemeColors);
    console.log(theme);
    console.log(calculatedThemeColors.darkColor);
    console.log(nonCustomHeaderPage);

    if (!nonCustomHeaderPage) {
    const backgroundColor = calculatedThemeColors.darkColor;
    
    const whiteContrast = tinycolor.readability(backgroundColor, 'white');
    const blackContrast = tinycolor.readability(backgroundColor, 'black');

    // Choose the color with better readability
    const readableColor = whiteContrast > blackContrast ? null : 'black';

    setColor(readableColor);
    } else {
        const readableColor = theme == 'dark' ? null : 'black';
        setColor(readableColor);
    }
}, [theme, nonCustomHeaderPage, calculatedThemeColors, selectedFriend]);
   
  return (
    <>   
    <StatusBar
      barStyle={color ? 'dark-content' : 'light-content'} 
      translucent={true}
      backgroundColor="transparent" 
    /> 
    </>
  );
};

export default PhoneStatusBar;
