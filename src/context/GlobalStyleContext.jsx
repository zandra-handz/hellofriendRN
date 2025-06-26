import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { StyleSheet } from "react-native";

//import { updateUserAccessibilitySettings } from "../calls/api";
import { useColorScheme } from "react-native";
import { useUserSettings } from "./UserSettingsContext";

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
  const { settings } = useUserSettings();

  console.log("GLOBAL STYLES RERENDERED");
  const colorScheme = useColorScheme();

  // Default state
  const [styles, setStyles] = useState({
    fontSize: 16,
    highContrast: false,
    screenReader: false,
    receiveNotifications: false,
    theme: colorScheme || "light",
    gradientColors: {
      darkColor: "#4caf50",
      lightColor: "#a0f143",
    },
    gradientColorsHome: {
      darkColor: "#000002",
      midpointColor: "#0B1C04", // using this as second color when keyboard visible on home screen because the gradient shrinks
      lightColor: "#163805",
    },
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

  const determineTheme = () => {
    if (settings.manual_dark_mode !== null) {
      return settings.manual_dark_mode ? "dark" : "light";
    }
    return colorScheme || "light";
  };

  useEffect(() => {
    if (settings) {
      console.log("settings triggered globalstyles");

      const newFontSize = settings.large_text ? 20 : 16;
      const newHighContrast = settings.high_contrast_mode;
      const newScreenReader = settings.screen_reader;
      const newReceiveNotifications = settings.receive_notifications;
      const newTheme = determineTheme();

      setStyles((prevStyles) => {
        if (
          prevStyles.fontSize === newFontSize &&
          prevStyles.highContrast === newHighContrast &&
          prevStyles.screenReader === newScreenReader &&
          prevStyles.receiveNotifications === newReceiveNotifications &&
          prevStyles.theme === newTheme
        ) {
          return prevStyles; // No changes, skip re-render
        }

        return {
          ...prevStyles,
          fontSize: newFontSize,
          highContrast: newHighContrast,
          screenReader: newScreenReader,
          receiveNotifications: newReceiveNotifications,
          theme: newTheme,
        };
      });
    } else {
      const fallbackTheme = colorScheme || "light";

      setStyles((prevStyles) => {
        if (prevStyles.theme === fallbackTheme) return prevStyles;

        return {
          ...prevStyles,
          theme: fallbackTheme,
        };
      });
    }
  }, [settings, colorScheme]);

  //   useEffect(() => {
  //   if (settings) {
  //       console.log('settings triggered globalstyles');
  //     setStyles((prevStyles) => ({
  //       ...prevStyles,
  //       fontSize: settings.large_text ? 20 : 16,
  //       highContrast: settings.high_contrast_mode,
  //       screenReader: settings.screen_reader,
  //       receiveNotifications: settings.receive_notifications,
  //       theme: determineTheme(),
  //     }));
  //   } else {
  //     setStyles((prevStyles) => ({
  //       ...prevStyles,
  //       theme: colorScheme || "light",
  //     }));
  //   }
  // }, [settings, colorScheme]);

  useEffect(() => {
    const isLight = styles.theme === "light";

    setStyles((prev) => {
      const newGradient = isLight
        ? {
            darkColor: "#ffffff",
            lightColor: "#ffffff",
          }
        : {
            darkColor: "#4caf50",
            lightColor: "#a0f143",
          };

      const newHome = isLight
        ? {
            darkColor: "#ffffff",
            lightColor: "#ffffff",
          }
        : {
            darkColor: "#000002",
            lightColor: "#163805",
          };

      const gradientsUnchanged =
        JSON.stringify(prev.gradientColors) === JSON.stringify(newGradient) &&
        JSON.stringify(prev.gradientColorsHome) === JSON.stringify(newHome);

      if (gradientsUnchanged) return prev;

      return {
        ...prev,
        gradientColors: newGradient,
        gradientColorsHome: newHome,
      };
    });
  }, [styles.theme]);

  // // light/dark switcher
  //   useEffect(() => {
  //     console.log('use effect triggered bt styles.theme');
  //     if (styles.theme === "light") {
  //       setStyles((prevStyles) => ({
  //         ...prevStyles,
  //         gradientColors: {
  //           darkColor: "#ffffff",
  //           lightColor: "#ffffff",
  //         },
  //         gradientColorsHome: {
  //           darkColor: "#ffffff",
  //           lightColor: "#ffffff",
  //         },
  //       }));
  //     } else {
  //       setStyles((prevStyles) => ({
  //         ...prevStyles,
  //         gradientColors: {
  //           darkColor: "#4caf50",
  //           lightColor: "#a0f143",
  //         },
  //         gradientColorsHome: {
  //           darkColor: "#000002",
  //           lightColor: "#163805",
  //         },
  //       }));
  //     }
  //   }, [styles.theme]);

  const themeStyles =
    styles.theme === "dark" ? darkThemeStyles : lightThemeStyles;
  const appContainerStyles = containerStyles;
  const appFontStyles = fontStyles;
  const appSpacingStyles = spacingStyles;
  const appAnimationStyles = animationStyles;
  const appCrossThemeStyles = crossThemeStyles;

  const themeStyleSpinners = {
    homeScreen: "flow",
  };

  return (
    <GlobalStyleContext.Provider
      value={{
        ...styles,
        themeStyles,
        appContainerStyles,
        appFontStyles,
        appSpacingStyles,
        appAnimationStyles,
        appCrossThemeStyles,
        themeStyleSpinners,
      }}
    >
      {children}
    </GlobalStyleContext.Provider>
  );
};

const containerStyles = StyleSheet.create({
  //removed from signinbutton
  signInButtonContainer: {
    borderRadius: 30,
    paddingVertical: "3%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  screenContainer: {
    width: "100%",
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },

  bodyContainer: {
    alignContent: "center",
    alignSelf: "center",
    borderWidth: 0,
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // borderRadius: 30,
    flexDirection: "column",
    zIndex: 1,
    elevation: 1,
  },

  homeHeaderContainer: {
    flexDirection: "row",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-between",
    height: 38,
    width: "100%",
  },

  homeScreenButton: {
    flexDirection: "row",
    paddingHorizontal: 20,
    flex: 1,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    borderRadius: 26,
  },
  smallAddButton: {
    height: "auto",
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 6,
    paddingLeft: 0,
    paddingVertical: 2,
    borderRadius: 16,
    borderWidth: 1,
    opacity: 0.8,
  },
  headerContainer: {
    paddingHorizontal: 18,
    height: 60,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAutoHeightContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "auto",
    maxHeight: 60,
  },
  settingsHeaderContainer: {
    // friend and user settings screens
    flexDirection: "row",
    padding: 10,
    paddingTop: 0,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
  },
  settingsHeaderLeftContainer: {
    width: "10%",
    alignItems: "flex-start",
  },
  settingsHeaderRightContainer: {
    width: "10%",
    alignItems: "flex-start",
  },
  settingsHeaderMiddleContainer: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  categoryButton: {
    // borderBottomWidth: 0.8,
    borderWidth: StyleSheet.hairlineWidth,
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    borderRadius: 16,
    // marginBottom: "3%",
    height: "auto",
  },

  actionUnlockedButton: {
    // borderBottomWidth: 0.8,
    borderWidth: StyleSheet.hairlineWidth,
    alignText: "right",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 10,
    //marginHorizontal: 6,
    borderRadius: 16,
    height: "auto",
    width: "auto",
  },

  searchBarContainer: {
    zIndex: 2,
  },

  searchBarInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: "100%",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },

  searchBarDropDownContainer: {
    position: "absolute",
    padding: 10,

    right: -10,

    //height: 100,
    height: 100,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 1000,
    elevation: 1000,
  },
  searchBarResultsListContainer: {
    paddingHorizontal: 6,

    borderRadius: 20,
    zIndex: 1000,
  },
  searchBarResultListItem: {
    paddingVertical: 6,
    marginVertical: 4,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "left",
    justifyContent: "flex-start",

    height: "auto",
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  speedDialPositioning: {
    alignItems: "center",
    position: "absolute",
    flexWrap: "wrap",
    width: 73,
    alignContent: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    zIndex: 3000,
  },
  speedDialRootButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    zIndex: 3000,
    elevation: 3000,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
  },

  speedDialSmallButtonContainer: {
    alignItems: "center",
    position: "absolute",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  speedDialSmallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  talkingPointCard: {
    // used with: backgroundColor: themeStyles.primaryBackground.backgroundColor,
    padding: 20,
    borderRadius: 40,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },

  appMessageContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    zIndex: 100000,
    elevation: 100000,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 4,
    height: "auto",
    //flexGrow: 1,
    //flexWrap: 'wrap',
    flex: 1,
    minHeight: 100,
    maxHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  appMessageTextWrapper: {
    //this the colored body too
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: "auto",
    padding: 30,
    minHeight: 100,
    borderRadius: 20,

    flexWrap: "wrap",
    textAlign: "center",
  },

  loadingSpinnerWrapper: {
    flex: 1,
    width: "100%",
  },
  loadingFriendProfileButtonWrapper: {
    flex: 0.4,
    paddingRight: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  bigLizardRotate: {
    position: "absolute",
    zIndex: 0,
    bottom: -100,
    left: -90,
    transform: [
      { rotate: "60deg" },
      // Flip horizontally (mirror image)
    ],
    opacity: 0.8,
  },
  bigGeckoRotate: {
    zIndex: 50000,
    elevation: 50000,
    position: "absolute",
    zIndex: 0,
    bottom: -100,
    left: -90,
    transform: [
      { rotate: "-0deg" },
      // Flip horizontally (mirror image)
    ],
    opacity: 1,
  },
});

const animationStyles = StyleSheet.create({
  flashAnimContainer: {
    alignItems: "center",
    alignContents: "center",
    justifyContent: "center",

    textAlign: "center",
  },
  flashAnimMomentsContainer: {
    alignItems: "center",
    alignContents: "center",
    justifyContent: "center",
    textAlign: "center",

    height: "auto",
    minHeight: 130,
  },
  flashAnimText: {
    fontFamily: "Poppins-Bold",
    alignSelf: "center",
  },
});

const spacingStyles = StyleSheet.create({
  momentsScreenPrimarySpacing: {
    borderRadius: 40,
    padding: 20,
  },
  modalHeaderIconSize: 30,
});

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
    fontWeight: "bold",
    fontSize: 11,
    textTransform: "uppercase",
    height: "100%",
    alignSelf: "center",
  },
  actionUnlockedButtonText: {
    fontWeight: "bold",
    fontSize: 13,
    // textTransform: "uppercase",
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

//removed from signinbutton
const crossThemeStyles = StyleSheet.create({
  primaryDarkText: {
    color: "#121212",
  },
});

const lightThemeStyles = StyleSheet.create({
  // overlayBackgroundColor: {
  //   backgroundColor: "rgba(0, 0, 0, 0.6)",
  // },
    overlayBackgroundColor: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  lighterOverlayBackgroundColor: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  primaryText: {
    color: "#121212",
  },
  primaryBackground: {
    backgroundColor: "#ffffff",
  },
  darkerBackground: {
    backgroundColor: "#ccc",
  },
  darkestBackground: {
    backgroundColor: "#ccc",
  },

  dangerZoneText: {
    color: "#B22222",
  },
  signinText: {
    color: "black",
    fontFamily: "Poppins-Bold",
  },
  signInAppDescription: {
    fontColor: "black",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  container: {
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  genericTextBackground: {
    backgroundColor: "#ffffff",
  },
  genericTextBackgroundShadeTwo: {
    backgroundColor: "#ccc",
  },
  genericTextBackgroundShadeThree: {
    backgroundColor: "#ccc",
  },
  genericText: {
    color: "#121212",
  },
  genericIcon: {
    color: "#121212",
  },
  selectedIconBorder: {
    borderColor: "darkgreen",
  },
  subHeaderText: {
    color: "#121212",
  },
  input: {
    color: "#121212",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    width: "100%",
    borderColor: "lightgray",
    backgroundColor: "white",
    placeholderTextColor: "lightgray",
    fontFamily: "Poppins-Regular",
    textAlign: "left",
    fontSize: 16,
  },
  borderColor: {
    color: "white",
  },
  friendFocusSection: {
    backgroundColor: "white",
  },
  friendFocusSectionText: {
    color: "#121212",
  },
  friendFocusSectionIcon: {
    color: "#121212",
  },
  modalContainer: {
    backgroundColor: "white",
  },
  modalText: {
    color: "#121212",
  },
  modalIconColor: {
    color: "#121212",
  },
  toggleButtonColor: {
    backgroundColor: "#ccc",
  },
  toggleOn: {
    backgroundColor: "#4cd137",
  },
  toggleOff: {
    backgroundColor: "#dcdde1",
  },
  footerContainer: {
    backgroundColor: "white",
    borderTopWidth: 0.4,
    borderColor: "black",
  },
  headerContainer: {},
  headerContainerNoBorder: {
    backgroundColor: "white",
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: "gray",
  },
  footerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#121212",
  },
  footerIcon: {
    color: "#121212",
  },
  headerText: {
    color: "#121212",
  },
  headerIcon: {
    color: "#121212",
  },
  upcomingNavIcon: {
    color: "#121212",
  },
  upcomingNavText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#121212",
  },
  header: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  headerTextColor: "#121212",
});

const darkThemeStyles = StyleSheet.create({
  overlayBackgroundColor: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  lighterOverlayBackgroundColor: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  primaryText: {
    color: "#d3d3d3",
  },
  primaryBackground: {
    backgroundColor: "#121212",
  },

  signInButton: {
    backgroundColor: "#ebebeb", //'#e0e0e0',
  },
  darkerBackground: {
    backgroundColor: "#2B2B2B",
  },
  darkestBackground: {
    backgroundColor: "#242424",
  },

  dangerZoneText: {
    color: "#B22222",
  },
  signInAppDescription: {
    fontColor: "black",
    fontSize: 16,
  },
  container: {
    backgroundColor: "#050604",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  genericTextBackground: {
    backgroundColor: "#121212",
  },
  genericTextBackgroundShadeTwo: {
    backgroundColor: "#2B2B2B",
  },
  genericTextBackgroundShadeThree: {
    backgroundColor: "#242424",
  },
  genericText: {
    color: "#d3d3d3",
  },
  genericIcon: {
    color: "#d3d3d3",
  },
  selectedIconBorder: {
    borderColor: "#d4edda",
  },
  subHeaderText: {
    color: "#d3d3d3",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  input: {
    color: "#d3d3d3",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    backgroundColor: "#121212",
    placeholderTextColor: "darkgray",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    width: "100%",
    fontFamily: "Poppins-Regular",
    textAlign: "left",
    fontSize: 16,
  },
  borderColor: {
    color: "#121212",
  },
  friendFocusSection: {
    backgroundColor: "#121212",
  },
  friendFocusSectionText: {
    color: "#d3d3d3",
  },
  friendFocusSectionIcon: {
    color: "#d3d3d3",
  },
  modalContainer: {
    backgroundColor: "#2B2B2B",
  },
  modalText: {
    color: "#d3d3d3",
  },
  modalIconColor: {
    color: "#d3d3d3",
  },
  toggleButtonColor: {
    backgroundColor: "#ccc",
  },
  toggleOn: {
    backgroundColor: "#4cd137",
  },
  toggleOff: {
    backgroundColor: "#dcdde1",
  },
  footerContainer: {
    backgroundColor: "#000002",
    borderTopWidth: 0.2,
    borderColor: "#4caf50",
  },
  headerContainer: {},
  headerContainerNoBorder: {
    backgroundColor: "#121212",
  },

  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  divider: {
    width: 0.4,
    backgroundColor: "#ccc",
  },
  footerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#d3d3d3",
  },
  footerIcon: {
    color: "#d3d3d3",
  },
  headerText: {
    color: "#d3d3d3",
  },
  headerIcon: {
    color: "#d3d3d3",
  },
  UpcomingNavText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    textAlign: "center",
    color: "#d3d3d3",
  },
  upcomingNavIcon: {
    color: "#d3d3d3",
  },
  header: {
    backgroundColor: "black",
    borderBottomColor: "darkgray",
    borderBottomWidth: 1,
  },
  headerTextColor: "#d3d3d3",
});

export default GlobalStyleProvider;
