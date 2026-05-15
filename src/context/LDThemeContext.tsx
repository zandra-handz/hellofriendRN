import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

type ThemeColors = {
  overlayBackground: string;
  darkerOverlayBackground: string;
  lighterOverlayBackground: string;
  primaryText: string;
  primaryBackground: string;
  shadowGeckoColor: string;
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
  overlayBackground: "#FFFFFF4D",
  darkerOverlayBackground: "#FFFFFF99",
  lighterOverlayBackground: "#00000099",
  primaryText: "#121212",
  primaryBackground: "#FFFFFF",
  shadowGeckoColor: "#D8D8D8",
  darkerBackground: "#CCCCCC",
  darkestBackground: "#CCCCCC",
  darkGlassBackground: "#F0F0FFCC",
  darkerGlassBackground: "#E6E6F5D4",
  dangerZoneText: "#B22222",
  toggleButtonColor: "#CCCCCC",
  toggleOn: "#4CD137",
  toggleOff: "#DCDDE1",
  divider: { width: 1, backgroundColor: "#808080" },
  header: { backgroundColor: "#FFFFFF", borderBottomColor: "#808080", borderBottomWidth: 1 },
  headerTextColor: "#121212",
  backdropColor: "#FFFFFFD9",
};

export const darkTheme: ThemeColors = {
  overlayBackground: "#00000075",
  darkerOverlayBackground: "#000000BF",
  lighterOverlayBackground: "#FFFFFF4D",
  primaryText: "#D3D3D3",
  primaryBackground: "#121212",
  shadowGeckoColor: "#2E2E2E",
  signInButton: "#EBEBEB",
  darkerBackground: "#2B2B2B",
  darkestBackground: "#242424",
  darkGlassBackground: "#000000CC",
  darkerGlassBackground: "#000000D4",
  dangerZoneText: "#B22222",
  borderColor: "#121212",
  toggleButtonColor: "#CCCCCC",
  toggleOn: "#4CD137",
  toggleOff: "#DCDDE1",
  divider: { width: 0.4, backgroundColor: "#CCCCCC" },
  header: { backgroundColor: "#000000", borderBottomColor: "#A9A9A9", borderBottomWidth: 1 },
  headerTextColor: "#D3D3D3",
  backdropColor: "#000000D9",
};