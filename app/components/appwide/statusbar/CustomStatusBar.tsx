import React, {  useMemo  } from 'react';
 
import { StatusBar } from 'expo-status-bar'; 
import { useColorScheme } from "react-native";    

const CustomStatusBar = ({manualDarkMode  }) => {   // settings?.manual_dark_mode
    const colorScheme = useColorScheme(); 
 
const color = useMemo(() => { 
  if (manualDarkMode === true) return 'light';
  if (manualDarkMode === false) return 'dark';
  return colorScheme === 'dark' ? 'light' : 'dark';
}, [manualDarkMode, colorScheme]);

 
 

    return (
        <>
            <StatusBar
                style={color} 
                translucent={true} 
            /> 
        </>
    );
};

export default CustomStatusBar;