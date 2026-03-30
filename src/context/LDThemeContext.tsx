import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

type ThemeColors = {
  overlayBackground: string;
  darkerOverlayBackground: string;
  lighterOverlayBackground: string;
  primaryText: string;
  primaryBackground: string;
  signInButton?: string;
  darkerBackground: string;
  darkestBackground: string;
  darkGlassBackground: string;
  darkerGlassBackground: string;
  dangerZoneText: string;
  borderColor?: string;
  toggleButtonColor: string;
  toggleOn: string;
  toggleOff: string;
  divider: {
    width: number;
    backgroundColor: string;
  };
  header: {
    backgroundColor: string;
    borderBottomColor: string;
    borderBottomWidth: number;
  };
  headerTextColor: string;
  backdropColor: string;
};

interface LightDarkThemeType {
  lightDarkTheme: ThemeColors;
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

  const lightDarkTheme: ThemeColors = theme === "dark" ? darkTheme : lightTheme;

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

export const lightTheme: ThemeColors = {
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

export const darkTheme: ThemeColors = {
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