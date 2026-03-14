// import React, {  useMemo  } from 'react';
 
// import { StatusBar } from 'expo-status-bar'; 
// import { useColorScheme } from "react-native";    

// const CustomStatusBar = ({manualDarkMode  }) => {   // settings?.manual_dark_mode
//     const colorScheme = useColorScheme(); 
 
// const color = useMemo(() => { 
//   if (manualDarkMode === true) return 'light';
//   if (manualDarkMode === false) return 'dark';
//   return colorScheme === 'dark' ? 'light' : 'dark';
// }, [manualDarkMode, colorScheme]);

 
 

//     return (
//         <>
//             <StatusBar
           
//                 style={color} 
//                 translucent={true} 
//             /> 
//         </>
//     );
// };

// export default CustomStatusBar;
import React, { useMemo, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ExpoStatusBar from 'expo-status-bar';
import { useColorScheme } from "react-native";
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';

const CustomStatusBar = ({ manualDarkMode }) => {
  const colorScheme = useColorScheme();
  const { isOnline } = useNetworkStatus();

  const color = useMemo(() => {
    if (!isOnline) return 'light';
    if (manualDarkMode === true) return 'light';
    if (manualDarkMode === false) return 'dark';
    return colorScheme === 'dark' ? 'light' : 'dark';
  }, [manualDarkMode, colorScheme, isOnline]);

  useEffect(() => {
    console.log('online')
    
    ExpoStatusBar.setStatusBarStyle(color);
    ExpoStatusBar.setStatusBarTranslucent(!isOnline ? false : true);
    ExpoStatusBar.setStatusBarBackgroundColor(
      !isOnline ? 'gray' : 'transparent',
      false
    );
  }, [color, isOnline]);

  return <StatusBar style={color} translucent={false} />;
};

export default CustomStatusBar;
// import React, { useMemo, useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { useColorScheme } from "react-native";
// import { networkRef } from '@/src/handlers/utils_networkStatus';

// const CustomStatusBar = ({ manualDarkMode }) => {
//   const colorScheme = useColorScheme();
//   const [isOnline, setIsOnline] = useState(networkRef.isOnline);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsOnline(networkRef.isOnline);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const color = useMemo(() => {
//     if (!isOnline) return 'light'; // gray background needs light icons
//     if (manualDarkMode === true) return 'light';
//     if (manualDarkMode === false) return 'dark';
//     return colorScheme === 'dark' ? 'light' : 'dark';
//   }, [manualDarkMode, colorScheme, isOnline]);

//   return (
//     <StatusBar
//       style={color}
//       translucent={true}
//       backgroundColor={!isOnline ? 'gray' : 'transparent'}
//     />
//   );
// };

// export default CustomStatusBar;