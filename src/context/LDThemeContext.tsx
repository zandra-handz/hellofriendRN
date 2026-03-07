// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
// } from "react";
 

// //import { updateUserAccessibilitySettings } from "../calls/api";
// import { useColorScheme } from "react-native"; 
// import useUserSettings from "../hooks/useUserSettings";


// interface LightDarkThemeType {
//   lightTheme: object;
//   darkTheme: object;
// }

// const LDThemeContext = createContext<LightDarkThemeType | undefined>(undefined);


// export const useLDTheme = () => {
//   const context =  useContext(LDThemeContext);

//   if (!context) {
//     throw new Error(
//       "useLDTheme must be used within a LDTheme provider"
//     );
//   }
//   return context;
// };

// interface LightDarkThemeProviderProps { children: React.ReactNode; }

// export const LDThemeProvider: React.FC<LightDarkThemeProviderProps> = ({ children }) => {
//   const { settings } = useUserSettings(); 
//   const colorScheme = useColorScheme();

//   const [styles, setStyles] = useState({
//     fontSize: 16,
//     highContrast: false,
//     screenReader: false,
//     receiveNotifications: false,
//     theme: colorScheme || "light", 
//   });

//   useEffect(() => {
//     if (!settings) return;
//     console.log('rerendering LD theme useeffect');
//     const newTheme =
//       settings.manual_dark_mode !== null
//         ? settings.manual_dark_mode
//           ? "dark"
//           : "light"
//         : colorScheme || "light";

//     setStyles((prev) =>
//       prev.theme === newTheme ? prev : { ...prev, theme: newTheme }
//     );
//   }, [settings?.manual_dark_mode, colorScheme]);

//   const lightDarkTheme = styles.theme === "dark" ? darkTheme : lightTheme;

//   const contextValue = useMemo(
//     () => ({
//       ...styles,
//       lightDarkTheme,
//     }),
//     [styles, lightDarkTheme]
//   );

//   return (
//     <LDThemeContext.Provider value={contextValue}>
//       {children}
//     </LDThemeContext.Provider>
//   );
// };

// export const lightTheme = {
//   // colors: {
//   overlayBackground: "rgba(255, 255, 255, 0.3)",
//   darkerOverlayBackground: "rgba(255, 255, 255, 0.6)",
//   lighterOverlayBackground: "rgba(0, 0, 0, 0.6)",
//   primaryText: "#121212",
//   primaryBackground: "#ffffff",
//   darkerBackground: "#ccc",
//   darkestBackground: "#ccc",
// darkGlassBackground:  "rgba(240, 240, 255, 0.8)",   // soft frosty white
// darkerGlassBackground: "rgba(230, 230, 245, 0.83)", // slightly deeper frost
//   dangerZoneText: "#B22222",
 
//   toggleButtonColor: "#ccc",
//   toggleOn: "#4cd137",
//   toggleOff: "#dcdde1",
//   divider: {
//     width: 1,
//     backgroundColor: "gray",
//   },
//     header: {
//     backgroundColor: "white",
//     borderBottomColor: "gray",
//     borderBottomWidth: 1,
//   },
//   headerTextColor: "#121212",
//   backdropColor: "rgba(255,255,255,.85)"
 
// };

// export const darkTheme = { 
//     overlayBackground: "rgba(0, 0, 0, 0.46)",
//   darkerOverlayBackground: "rgba(0, 0, 0, 0.75)",
//   lighterOverlayBackground: "rgba(255, 255, 255, 0.3)",
//   primaryText: "#d3d3d3",
//   primaryBackground: "#121212",
//   signInButton: "#ebebeb",
//   darkerBackground: "#2B2B2B",
//   darkestBackground: "#242424",
//   darkGlassBackground:  "rgba(0,0,0,0.8)",
//   darkerGlassBackground: "rgba(0,0,0,0.83)",
//   dangerZoneText: "#B22222",
//   borderColor: "#121212",
//   toggleButtonColor: "#ccc",
//   toggleOn: "#4cd137",
//   toggleOff: "#dcdde1",
//   divider: {
//     width: 0.4,
//     backgroundColor: "#ccc",
//   },
//     header: {
//     backgroundColor: "black",
//     borderBottomColor: "darkgray",
//     borderBottomWidth: 1,
//   },
//   headerTextColor: "#d3d3d3",
//   backdropColor: "rgba(0,0,0,.85) "

 
// }; 


import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

interface LightDarkThemeType {
  lightDarkTheme: object;
  theme: string;
  setManualDarkMode: (value: boolean | null) => void;
}

const LDThemeContext = createContext<LightDarkThemeType | undefined>(undefined);

export const useLDTheme = () => {
  const context = useContext(LDThemeContext);
  if (!context) throw new Error("useLDTheme must be used within a LDThemeProvider");
  return context;
};

export const LDThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [manualDarkMode, setManualDarkMode] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<string>(colorScheme || "light");

  useEffect(() => {
    const newTheme =
      manualDarkMode !== null
        ? manualDarkMode ? "dark" : "light"
        : colorScheme || "light";
    setTheme((prev) => (prev === newTheme ? prev : newTheme));
  }, [manualDarkMode, colorScheme]);

  const lightDarkTheme = theme === "dark" ? darkTheme : lightTheme;

  const contextValue = useMemo(
    () => ({ lightDarkTheme, theme, setManualDarkMode }),
    [theme, lightDarkTheme]
  );

  return (
    <LDThemeContext.Provider value={contextValue}>
      {children}
    </LDThemeContext.Provider>
  );
};

export const lightTheme = {
  overlayBackground: "rgba(255, 255, 255, 0.3)",
  darkerOverlayBackground: "rgba(255, 255, 255, 0.6)",
  lighterOverlayBackground: "rgba(0, 0, 0, 0.6)",
  primaryText: "#121212",
  primaryBackground: "#ffffff",
  darkerBackground: "#ccc",
  darkestBackground: "#ccc",
  darkGlassBackground: "rgba(240, 240, 255, 0.8)",
  darkerGlassBackground: "rgba(230, 230, 245, 0.83)",
  dangerZoneText: "#B22222",
  toggleButtonColor: "#ccc",
  toggleOn: "#4cd137",
  toggleOff: "#dcdde1",
  divider: { width: 1, backgroundColor: "gray" },
  header: { backgroundColor: "white", borderBottomColor: "gray", borderBottomWidth: 1 },
  headerTextColor: "#121212",
  backdropColor: "rgba(255,255,255,.85)",
};

export const darkTheme = {
  overlayBackground: "rgba(0, 0, 0, 0.46)",
  darkerOverlayBackground: "rgba(0, 0, 0, 0.75)",
  lighterOverlayBackground: "rgba(255, 255, 255, 0.3)",
  primaryText: "#d3d3d3",
  primaryBackground: "#121212",
  signInButton: "#ebebeb",
  darkerBackground: "#2B2B2B",
  darkestBackground: "#242424",
  darkGlassBackground: "rgba(0,0,0,0.8)",
  darkerGlassBackground: "rgba(0,0,0,0.83)",
  dangerZoneText: "#B22222",
  borderColor: "#121212",
  toggleButtonColor: "#ccc",
  toggleOn: "#4cd137",
  toggleOff: "#dcdde1",
  divider: { width: 0.4, backgroundColor: "#ccc" },
  header: { backgroundColor: "black", borderBottomColor: "darkgray", borderBottomWidth: 1 },
  headerTextColor: "#d3d3d3",
  backdropColor: "rgba(0,0,0,.85)",
};