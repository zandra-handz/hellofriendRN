import React, { createContext, useContext, useState, useEffect } from "react";
import { StyleSheet, AccessibilityInfo } from "react-native";
import { useUser } from "./UserContext";
//import { updateUserAccessibilitySettings } from "../calls/api";
import { useColorScheme } from "react-native";

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
  const { user, userAppSettings, updateAppSettingsMutation } = useUser();
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

  useEffect(() => {
    if (user.authenticated && userAppSettings) {
      const determineTheme = () => {
        if (userAppSettings.manual_dark_mode !== null) {
          return userAppSettings.manual_dark_mode ? "dark" : "light";
        }
        return colorScheme || "light";
      };

      setStyles((prevStyles) => ({
        ...prevStyles,
        fontSize: userAppSettings.large_text ? 20 : 16,
        highContrast: userAppSettings.high_contrast_mode,
        screenReader: userAppSettings.screen_reader,
        receiveNotifications: userAppSettings.receive_notifications,
        theme: determineTheme(),
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        theme: colorScheme || "light",
      }));
    }
  }, [user.authenticated, userAppSettings, colorScheme]);

  useEffect(() => {
    if (styles.theme === "light") {
      setStyles((prevStyles) => ({
        ...prevStyles,
        gradientColors: {
          darkColor: "#ffffff",
          lightColor: "#ffffff",
        },
        gradientColorsHome: {
          darkColor: "#ffffff",
          lightColor: "#ffffff",
        },
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        gradientColors: {
          darkColor: "#4caf50",
          lightColor: "#a0f143",
        },
        gradientColorsHome: {
          darkColor: "#000002",
          lightColor: "#163805",
        },
      }));
    }
  }, [styles.theme]);

  //working on removing and replacing with RQ mutation directly
  //this is mainly used in SectionSettingsAccessibility
  const updateUserAccessibility = async (updates) => {
    try {
      //await updateUserAccessibilitySettings(authUserState.user.id, updates);
      updateAppSettingsMutation.mutate({
        ...userAppSettings,
        ...updates,
      });
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  useEffect(() => {
    if (!user.authenticated) {
      return;
    }

    const screenReaderListener = AccessibilityInfo.addEventListener(
      "screenReaderChanged",

      async (isActive) => {
        console.log("SCREEN READER GLOBAL STYLE");
        if (user.user) {
          updateAppSettingsMutation.mutate({
            userId: user.user.id,
            setting: { screen_reader: isActive },
          });
        }
      }
    );
    return () => {
      screenReaderListener.remove();
    };
  }, [user.authenticated]);

  const themeStyles =
    styles.theme === "dark" ? darkThemeStyles : lightThemeStyles;
  const appContainerStyles = containerStyles;
  const appFontStyles = fontStyles;
  const appSpacingStyles = spacingStyles;
  const ConstantColorsStyles = constantColors;
  const appAnimationStyles = animationStyles;

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
        ConstantColorsStyles,
        themeStyleSpinners,
      }}
    >
      {children}
    </GlobalStyleContext.Provider>
  );
};

const containerStyles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    flex: 1,
    zIndex: 1,
  },

  homeHeaderContainer: {
    flexDirection: "row",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
    borderBottomWidth: 0.4,
    borderColor: "transparent",
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
    borderRadius: 30,
  },
  headerContainer: {
    paddingHorizontal: 18,
    height: 70,
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
  categoryNavigatorContainer: {
    position: "absolute",
    bottom: 18, //20
    left: 4,
    zIndex: 5,
    height: "auto",
    maxHeight: "20%",
    width: "74%",
  },
  categoryButton: {
    // borderBottomWidth: 0.8,
    borderWidth: StyleSheet.hairlineWidth,
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    borderRadius: 16,
    marginBottom: "3%",
    height: "auto",
  },
  categoryCreatorContainer: {
    width: "100%",
    borderRadius: 20,
    flexWrap: "wrap", // Change this to flex-start
    flexDirection: "column",
    flex: 1,
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
    top: 30,
    right: -10,
    width: 300, 
    maxHeight: 100,
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
    paddingVertical: 4,
    borderBottomWidth: 1, 
    borderRadius: 0,
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
});

const fontStyles = StyleSheet.create({
  homeHeaderText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
  },
  globalAppHeaderText: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
  },
  homeScreenButtonText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
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
});

const constantColors = StyleSheet.create({});

const lightThemeStyles = StyleSheet.create({
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
  primaryText: {
    color: "#d3d3d3",
  },
  primaryBackground: {
    backgroundColor: "#121212",
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
  signinText: {
    color: "white",
    fontFamily: "Poppins-Bold",
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
