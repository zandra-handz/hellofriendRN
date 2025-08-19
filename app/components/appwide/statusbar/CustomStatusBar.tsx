import React, { useEffect, useState, useMemo  } from 'react';
// import { StatusBar } from 'react-native'; 
import { StatusBar } from 'expo-status-bar'; 
import { useColorScheme } from "react-native";  
import { useUserSettings } from '@/src/context/UserSettingsContext';

const CustomStatusBar = () => { 
   // const { userAppSettings } = useUser();  
    const { settings } = useUserSettings();
    const colorScheme = useColorScheme();
    // const [color, setColor] = useState(); 


const manualDarkMode = settings?.manual_dark_mode;

const color = useMemo(() => {
    // console.log('custom status bar use memo triggered by settings');
  if (manualDarkMode === true) return 'light';
  if (manualDarkMode === false) return 'dark';
  return colorScheme === 'dark' ? 'light' : 'dark';
}, [manualDarkMode, colorScheme]);


    // const color = useMemo(() => {

    //      if (!settings) return undefined;

    //     let colorCheck;

    //     if (settings.manual_dark_mode === true) {
    //     colorCheck = 'light';
    //     } else if (settings.manual_dark_mode === false) {
    //         colorCheck = 'dark';
    //     } else {
    //         colorCheck = colorScheme === 'dark' ? 'light' : 'dark';
    //     }
        
    //     return colorCheck;


    // }, [settings, colorScheme]);

    // useEffect(() => {
    //     if (settings) {
    //         if (settings.manual_dark_mode === true) {
    //             setColor('light');
    //         } else if (settings.manual_dark_mode === false) {
    //             setColor('dark');
    //         } else {
    //             let phoneTheme;
    //             phoneTheme = colorScheme === "dark" ? "light" : "dark";
    //             setColor(phoneTheme);
    //         } 
    //     }
        
    //     // Log the screen and color change
    //   //  console.log(`Current screen: ${pathname}, ${segments} setColor in CustomStatusBar: ${color}`);
    // }, [settings]); //, pathname]); // Make sure to add router.pathname to dependencies
 

    return (
        <>
            <StatusBar
                style={color} 
                translucent={true}
                //backgroundColor="transparent"
            /> 
        </>
    );
};

export default CustomStatusBar;