import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
 

//import { updateUserAccessibilitySettings } from "../calls/api";
import { useColorScheme } from "react-native";
import { useUserSettings } from "./UserSettingsContext";

const LDThemeContext = createContext();

export const useLDTheme = () => useContext(LDThemeContext);

export const LDThemeProvider = ({ children }) => {
  const { settings } = useUserSettings(); 
  const colorScheme = useColorScheme();

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
    if (!settings) return;
    console.log('rerendering LD theme useeffect');
    const newTheme =
      settings.manual_dark_mode !== null
        ? settings.manual_dark_mode
          ? "dark"
          : "light"
        : colorScheme || "light";

    setStyles((prev) =>
      prev.theme === newTheme ? prev : { ...prev, theme: newTheme }
    );
  }, [settings?.manual_dark_mode, colorScheme]);

  const lightDarkTheme = styles.theme === "dark" ? darkTheme : lightTheme;

  const contextValue = useMemo(
    () => ({
      ...styles,
      lightDarkTheme,
    }),
    [styles, lightDarkTheme]
  );

  return (
    <LDThemeContext.Provider value={contextValue}>
      {children}
    </LDThemeContext.Provider>
  );
};

export const lightTheme = {
  // colors: {
  overlayBackground: "rgba(255, 255, 255, 0.3)",
  darkerOverlayBackground: "rgba(255, 255, 255, 0.6)",
  lighterOverlayBackground: "rgba(0, 0, 0, 0.6)",
  primaryText: "#121212",
  primaryBackground: "#ffffff",
  darkerBackground: "#ccc",
  darkestBackground: "#ccc",
  dangerZoneText: "#B22222",
 
  toggleButtonColor: "#ccc",
  toggleOn: "#4cd137",
  toggleOff: "#dcdde1",
  divider: {
    width: 1,
    backgroundColor: "gray",
  },
    header: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  headerTextColor: "#121212",
 
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
  dangerZoneText: "#B22222",
  borderColor: "#121212",
  toggleButtonColor: "#ccc",
  toggleOn: "#4cd137",
  toggleOff: "#dcdde1",
  divider: {
    width: 0.4,
    backgroundColor: "#ccc",
  },
    header: {
    backgroundColor: "black",
    borderBottomColor: "darkgray",
    borderBottomWidth: 1,
  },
  headerTextColor: "#d3d3d3",

 
}; 
