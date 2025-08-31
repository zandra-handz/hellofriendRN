import React, {
  createContext,
  useContext,
  useState,

  useMemo,
} from "react";
import { StyleSheet } from "react-native";

//import { updateUserAccessibilitySettings } from "../calls/api";
 

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
 
 console.log("GLOBAL STYLES RERENDERED");
 

  // Default state
  const [styles, setStyles] = useState({
 
 
    manualGradientColors: {
      darkColor: "#4caf50",
      lightColor: "#a0f143",
      lighterLightColor: "#b2f45c",
      darkerLightColor: "#8fd83a",
      homeDarkColor: "#000002",
      homeLightColor: "#163805",
    },
    gradientDirection: { x: 1, y: 0 },
  });

 

  // useEffect(() => {

  //   if (!colorScheme) {
  //     return;
  //   }
  //   if (settings) {
  //      console.log("settings triggered globalstyles");

  //     // const newFontSize = settings.large_text ? 20 : 16;
  //     // const newHighContrast = settings.high_contrast_mode;
  //     // const newScreenReader = settings.screen_reader;
  //     // const newReceiveNotifications = settings.receive_notifications;
  //     const newTheme = determineTheme();

  //     setStyles((prevStyles) => {
  //       if (
  //         // prevStyles.fontSize === newFontSize &&
  //         // prevStyles.highContrast === newHighContrast &&
  //         // prevStyles.screenReader === newScreenReader &&
  //         // prevStyles.receiveNotifications === newReceiveNotifications &&
  //         prevStyles.theme === newTheme
  //       ) {
  //         return prevStyles; // No changes, skip re-render
  //       }

  //       return {
  //         ...prevStyles,
  //         // fontSize: newFontSize,
  //         // highContrast: newHighContrast,
  //         // screenReader: newScreenReader,
  //         // receiveNotifications: newReceiveNotifications,
  //         theme: newTheme,
  //       };
  //     });
  //   } else {
  //     const fallbackTheme = colorScheme || "light";

  //     setStyles((prevStyles) => {
  //       if (prevStyles.theme === fallbackTheme) return prevStyles;

  //       return {
  //         ...prevStyles,
  //         theme: fallbackTheme,
  //       };
  //     });
  //   }
  // }, [settings, colorScheme]);

 
 
 
  const appFontStyles = fontStyles; 
 


  const contextValue = useMemo(() => ({
  ...styles, 
 
  appFontStyles,
 
  
}), [
  styles, 
 
  appFontStyles,
 
]);
 

  return (
<GlobalStyleContext.Provider value={contextValue}>
  {children}
</GlobalStyleContext.Provider>
  );
};
 

 
 
const fontStyles = StyleSheet.create({
  //removed from signin button
  signInButtonLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  homeHeaderText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
  },
  globalAppHeaderText: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
  },
  welcomeText: {
    fontSize: 32,
    lineHeight: 34,
    //fontWeight: 'bold',
    fontFamily: "Poppins-Regular",
  },
  subWelcomeText: {
    fontSize: 14,
    lineHeight: 20,
    //fontWeight: 'bold',
    fontFamily: "Poppins-Regular",
  },
  homeScreenNewMomentContainer: {
    borderRadius: 30,
    alignSelf: "center",
    padding: 4,
  },
  homeScreenButtonText: {
    fontSize: 16,
    // fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    // textTransform: "uppercase",
  },
  smallAddButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  settingsHeaderText: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
    textAlign: "center",
  },
  friendProfileButtonText: {
    fontSize: 17,
    paddingVertical: 0,
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
    paddingLeft: 0,
  },
  categoryButtonText: {
   // fontWeight: "bold",
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
 //   textTransform: "uppercase",
    height: "100%",
    alignSelf: "center",
  },

  searchBarInputText: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    fontSize: 13,
    textAlign: "right",
    overflow: "hidden",
    paddingHorizontal: 4,
    marginRight: 4,
    height: 50,
    fontFamily: "Poppins-Regular",
  },
  searchBarResultListItemText: {
    fontSize: 15,
  },
  momentHeaderText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  momentText: {
    fontSize: 11,
    lineHeight: 16,
  },
  momentViewHeaderText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  momentViewText: {
    fontSize: 13,
    lineHeight: 18,
  },
  appMessageText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

   

export default GlobalStyleProvider;
