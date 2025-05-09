import React, { useEffect, useState  } from 'react';
// import { StatusBar } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import { useAuthUser } from '@/src/context/AuthUserContext'; 
import { useColorScheme } from "react-native";  

const CustomStatusBar = () => { 
    const { userAppSettings } = useAuthUser();  
    const colorScheme = useColorScheme();
    const [color, setColor] = useState(); 

    useEffect(() => {
        if (userAppSettings) {
            if (userAppSettings.manual_dark_mode === true) {
                setColor('light');
            } else if (userAppSettings.manual_dark_mode === false) {
                setColor('dark');
            } else {
                let phoneTheme;
                phoneTheme = colorScheme === "dark" ? "light" : "dark";
                setColor(phoneTheme);
            } 
        }
        
        // Log the screen and color change
      //  console.log(`Current screen: ${pathname}, ${segments} setColor in CustomStatusBar: ${color}`);
    }, [userAppSettings]); //, pathname]); // Make sure to add router.pathname to dependencies
 

    return (
        <>
            <StatusBar
                style={color} 
                translucent={true}
                backgroundColor="transparent"
            /> 
        </>
    );
};

export default CustomStatusBar;