import { View, Text } from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Friend } from "../types/FriendTypes";
 
type Props = {
  userId: number;
  setThemeState: () => void;
};

const useUpdateFriendListColors = ({ userId, setThemeState }: Props) => {
  const queryClient = useQueryClient();

  const updateFriendListColors = (
    friendId: number,
    darkColor: string,
    lightColor: string,
    fontColor: string,
    fontColorSecondary: string
  ) => {
    console.log("updating friend list colors");

    queryClient.setQueryData<{
      friends: Friend[];
      upcoming: UpcomingThing[];
      next: Friend | null;
    }>(["friendListAndUpcoming", userId], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        friends: oldData.friends.map((friend) =>
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
        ),
        // upcoming + next are preserved
      };
    });

    setThemeState({
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    });
  };

  const updateFriendListColorsExcludeSaved = (
    friendId: number,
    darkColor: string,
    lightColor: string,
    fontColor: string,
    fontColorSecondary: string
  ) => {
    queryClient.setQueryData<{
      friends: Friend[];
      upcoming: UpcomingThing[];
      next: Friend | null;
    }>(["friendListAndUpcoming", userId], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        friends: oldData.friends.map((friend) =>
          friend.id === friendId
            ? {
                ...friend,
                theme_color_dark: darkColor,
                theme_color_light: lightColor,
                theme_color_font: fontColor,
                theme_color_font_secondary: fontColorSecondary,
                // saved_* untouched
              }
            : friend
        ),
      };
    });

    setThemeState({
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    });
  };

  return {
    updateFriendListColors,
    updateFriendListColorsExcludeSaved,
  };
};

export default useUpdateFriendListColors;
