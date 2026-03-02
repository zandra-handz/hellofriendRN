import React, { useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FriendDashboardData } from "@/src/types/FriendTypes";
import { updateFriendFavesColorThemeSetting, updateFriendFavesColorTheme, enableManualColorTheme } from "@/src/calls/api";
import manualGradientColors from "@/app/styles/StaticColors";

interface ColorThemeUpdateProps {
  savedDarkColor?: string;
  savedLightColor?: string;
  appDarkColor?: string;
  appLightColor?: string;
  manualThemeOn?: boolean;
  fontColor?: string;
  fontColorSecondary?: string;
}

interface ColorThemeUpdateLoad {
  userId: number;
  friendId: number;
  darkColor?: string;
  lightColor?: string;
  manualTheme: boolean;
  fontColor?: string;
  fontColorSecondary?: string;
}

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateFaveTheme = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();

  const updateFavesThemeMutation = useMutation({
    mutationFn: (data: ColorThemeUpdateLoad) =>
      updateFriendFavesColorThemeSetting(data),

    onSuccess: (data) => {
      queryClient.setQueryData<FriendDashboardData>(
        ["friendDashboardData", userId, friendId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            friend_faves: {
              ...oldData.friend_faves,
              use_friend_color_theme: data.use_friend_color_theme,
            },
          };
        }
      );
    },
  });

  const updateColorsMutation = useMutation({
    mutationFn: ({
      darkColor,
      lightColor,
      fontColor,
      fontColorSecondary,
    }: {
      darkColor: string;
      lightColor: string;
      fontColor: string;
      fontColorSecondary: string;
    }) =>
      updateFriendFavesColorTheme(
        userId,
        friendId,
        darkColor,
        lightColor,
        fontColor,
        fontColorSecondary
      ),

    onSuccess: (data) => {
      queryClient.setQueryData<FriendDashboardData>(
        ["friendDashboardData", userId, friendId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            friend_faves: {
              ...oldData.friend_faves,
              use_friend_color_theme: data.use_friend_color_theme,
              dark_color: data.dark_color,
              light_color: data.light_color,
              font_color: data.font_color,
              font_color_secondary: data.font_color_secondary,
            },
          };
        }
      );
    },
  });

  const handleTurnOffManual = ({
    appDarkColor,
    appLightColor,
    fontColor,
    fontColorSecondary,
  }: ColorThemeUpdateProps) => {
    if (!userId || !friendId) return;

    try {
      updateFavesThemeMutation.mutate({
        userId,
        friendId,
        darkColor: manualGradientColors.darkColor,
        lightColor: manualGradientColors.lightColor,
        manualTheme: false,
        fontColor,
        fontColorSecondary,
      });
    } catch (error) {
      console.error("Error turning off manual theme:", error);
    }
  };

  const enableManualMutation = useMutation({
    mutationFn: () => enableManualColorTheme(friendId),
    onSuccess: (data) => {
      queryClient.setQueryData<FriendDashboardData>(
        ["friendDashboardData", userId, friendId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            friend_faves: {
              ...oldData.friend_faves,
              use_friend_color_theme: data.use_friend_color_theme,
              dark_color: data.dark_color,
              light_color: data.light_color,
            },
          };
        }
      );
    },
  });

const handleTurnOnManual = async () => {
    if (!userId || !friendId) return;
    try {
      return await enableManualMutation.mutateAsync();
    } catch (error) {
      console.error("Error turning on manual theme:", error);
    }
  };
  // const handleTurnOnManual = ({
  //   savedDarkColor,
  //   savedLightColor,
  //   fontColor,
  //   fontColorSecondary,
  // }: ColorThemeUpdateProps) => {
  //   if (!userId || !friendId) return;

  //   try {
  //     updateFavesThemeMutation.mutate({
  //       userId,
  //       friendId,
  //       darkColor: savedDarkColor,
  //       lightColor: savedLightColor,
  //       manualTheme: true,
  //       fontColor,
  //       fontColorSecondary,
  //     });
  //   } catch (error) {
  //     console.error("Error turning on manual theme:", error);
  //   }
  // };

  const handleUpdateManualColors = async ({
    darkColor,
    lightColor,
    fontColor,
    fontColorSecondary,
  }: {
    darkColor: string;
    lightColor: string;
    fontColor: string;
    fontColorSecondary: string;
  }) => {
    if (!userId || !friendId) return;

    try {
      return await updateColorsMutation.mutateAsync({
        darkColor,
        lightColor,
        fontColor,
        fontColorSecondary,
      });
  } catch (error) {
      console.error("Error during handleUpdateManualColors:", error);
    }
  };

  return { handleTurnOffManual, handleTurnOnManual, handleUpdateManualColors };
};

export default useUpdateFaveTheme;