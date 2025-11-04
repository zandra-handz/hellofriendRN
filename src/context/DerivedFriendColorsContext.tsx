// src/context/ThemeColorsContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import { useSelectedFriend } from "./SelectedFriendContext";
import { manualGradientColors } from "@/app/styles/ManualGradientColors";

const ThemeColorsContext = createContext(null);

export const ThemeColorsProvider = ({ children }) => {
  const { selectedFriend } = useSelectedFriend();

  const themeColors = useMemo(() => ({
    lightColor: selectedFriend?.lightColor ?? manualGradientColors.lightColor,
    darkColor: selectedFriend?.darkColor ?? manualGradientColors.darkColor,
    fontColor: selectedFriend?.fontColor ?? manualGradientColors.homeDarkColor,
    fontColorSecondary: selectedFriend?.fontColorSecondary ?? manualGradientColors.homeDarkColor,
  }), [selectedFriend?.id]);

  return (
    <ThemeColorsContext.Provider value={themeColors}>
      {children}
    </ThemeColorsContext.Provider>
  );
};

export const useThemeColors = () => useContext(ThemeColorsContext);
