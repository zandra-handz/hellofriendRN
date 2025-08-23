import { View, Text } from "react-native";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import { Friend, ThemeAheadOfLoading } from "../types/FriendTypes";

interface FriendStyleContextType {
  themeAheadOfLoading: ThemeAheadOfLoading;
  getThemeAheadOfLoading: (friend: Friend) => void;
}

//HARD CODE LIGHT DARK COLOR LOCATION:
//FRIENDTINTPRESSABLE unlikely to be resorted to but does have hard code to get TS to stop yelling at me

const FriendStyleContext = createContext<FriendStyleContextType>({
  themeAheadOfLoading: {
    darkColor: "#4caf50",
    lightColor: "#a0f143",
    fontColor: "#000000",
    fontColorSecondary: "#000000",
  },
  getThemeAheadOfLoading: () => {},
});

export const useFriendStyle = (): FriendStyleContextType =>
  useContext(FriendStyleContext);

interface FriendStyleProviderProps {
  children: ReactNode;
}

export const FriendStyleProvider: React.FC<FriendStyleProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const { user } = useUser();
  const [useGradientInSafeView, setUseGradientInSafeView] = useState(false);
  const [themeAheadOfLoading, setThemeAheadOfLoading] = useState({
    darkColor: "#4caf50",
    lightColor: "#a0f143",
    fontColor: "#000000",
    fontColorSecondary: "#000000",
  });

  const updateSafeViewGradient = (boolean: boolean) => {
    setUseGradientInSafeView((prev) => boolean);
  };

  const handleSetTheme = ({
    lightColor,
    darkColor,
    fontColor,
    fontColorSecondary,
  }) => {
    setThemeAheadOfLoading({
      lightColor: lightColor,
      darkColor: darkColor,
      fontColor: fontColor,
      fontColorSecondary: fontColorSecondary,
    });
  };

  const getThemeAheadOfLoading = (loadingFriend: Friend) => {
    handleSetTheme({
      lightColor: loadingFriend.theme_color_light || "#a0f143",
      darkColor: loadingFriend.theme_color_dark || "#4caf50",
      fontColor: loadingFriend.theme_color_font || "#000000",
      fontColorSecondary: loadingFriend.theme_color_font_secondary || "#000000",
    });
  };

  const resetTheme = () => {
    handleSetTheme({
      lightColor: "#a0f143",
      darkColor: "#4caf50",
      fontColor: "#000000",
      fontColorSecondary: "#000000",
    });
  };

  const updateFriendListColors = (
    friendId: number,
    darkColor: string,
    lightColor: string,
    fontColor: string,
    fontColorSecondary: string
  ) => {
    console.log("updating friend list colors");
    queryClient.setQueryData<Friend[]>(["friendList", user?.id], (oldData) => {
      if (!oldData) return oldData;

      return oldData.map((friend) =>
        friend.id === friendId
          ? {
              ...friend,
              theme_color_dark: darkColor,
              saved_color_dark: darkColor,
              theme_color_light: lightColor,
              saved_color_light: lightColor,
              theme_color_font: fontColor,
              theme_color_font_secondary: fontColorSecondary,
            }
          : friend
      );
    });
    setThemeAheadOfLoading({
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    });
  };

  // const updateFriendListColorsExcludeSaved = (
  //   friendId: number,
  //   darkColor: string,
  //   lightColor: string,
  //   fontColor: string,
  //   fontColorSecondary: string
  // ) => {
  //   queryClient.setQueryData<Friend[]>(["friendList", user?.id], (oldData) => {
  //     if (!oldData) return oldData;

  //     return oldData.map((friend) =>
  //       friend.id === friendId
  //         ? {
  //             ...friend,
  //             theme_color_dark: darkColor,
  //             theme_color_light: lightColor,
  //             theme_color_font: fontColor,
  //             theme_color_font_secondary: fontColorSecondary,
  //             // saved_* not updated here
  //           }
  //         : friend
  //     );
  //   });

  //   setThemeAheadOfLoading({
  //     lightColor,
  //     darkColor,
  //     fontColor,
  //     fontColorSecondary,
  //   });
  // };

  const contextValue = useMemo(
    () => ({
      themeAheadOfLoading,
      setThemeAheadOfLoading,
      getThemeAheadOfLoading,
      handleSetTheme,
      resetTheme,
      updateFriendListColors,
      // updateFriendListColorsExcludeSaved,
      useGradientInSafeView,
      setUseGradientInSafeView,
      updateSafeViewGradient,
    }),
    [
      themeAheadOfLoading,
      getThemeAheadOfLoading,
      resetTheme,
      handleSetTheme,
      updateFriendListColors,
      // updateFriendListColorsExcludeSaved,
      useGradientInSafeView,
      updateSafeViewGradient,
    ]
  );
  return (
    <FriendStyleContext.Provider value={contextValue}>
      {children}
    </FriendStyleContext.Provider>
  );
};

export default FriendStyleContext;
