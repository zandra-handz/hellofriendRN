import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext'; // Adjust the import path as necessary
import tinycolor from 'tinycolor2';
import { useFriendList } from '@/src/context/FriendListContext';
import { useFriendStyle } from '@/src/context/FriendStyleContext';
const PhoneStatusBar = () => {
const { theme, nonCustomHeaderPage } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();
  const [ color, setColor ] = useState('');


  useEffect(() => { 

    if (!nonCustomHeaderPage) {
    const backgroundColor = themeAheadOfLoading.darkColor;
    
    const whiteContrast = tinycolor.readability(backgroundColor, 'white');
    const blackContrast = tinycolor.readability(backgroundColor, 'black');
 
    const readableColor = whiteContrast > blackContrast ? null : 'black';

    setColor(readableColor);
    } else {
        const readableColor = theme == 'dark' ? null : 'black';
        setColor(readableColor);
    }
}, [theme, nonCustomHeaderPage, themeAheadOfLoading, selectedFriend]);
   
  return (
    <>   
    <StatusBar
      barStyle={color ? 'dark-content' : 'light-content'} 
      translucent={true}
      //backgroundColor="transparent" 
    /> 
    </>
  );
};

export default PhoneStatusBar;
