 

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import manualGradientColors from "@/app/styles/StaticColors";

const SELECTED_FRIEND_KEY = ['selectedFriend'];

const DEFAULT_FRIEND = {
  isReady: false,
  user: null,
  id: null,
  name: null,
  last_name: null,
  next_meet: null,
  saved_color_dark: null,
  saved_color_light: null,
  theme_color_dark: null,
  theme_color_light: null,
  theme_color_font: null,
  theme_color_font_secondary: null,
  suggestion_settings: null,
  created_on: null,
  updated_on: null,
  lightColor: manualGradientColors.lightColor,
  darkColor: manualGradientColors.darkColor,
  fontColor: manualGradientColors.homeDarkColor,
  fontColorSecondary: manualGradientColors.homeDarkColor,
};

const DEFAULT_READY_NO_FRIEND = {
  ...DEFAULT_FRIEND,
  isReady: true,
};

const selectedFriendQueryOptions = {
  queryKey: SELECTED_FRIEND_KEY,
  queryFn: () => DEFAULT_FRIEND,
  staleTime: Infinity,
  gcTime: Infinity,
} as const;

const safeColors = (friend: any) => ({
  darkColor: friend?.theme_color_dark ?? manualGradientColors.darkColor,
  lightColor: friend?.theme_color_light ?? manualGradientColors.lightColor,
  fontColor: friend?.theme_color_font ?? manualGradientColors.homeDarkColor,
  fontColorSecondary: friend?.theme_color_font_secondary ?? manualGradientColors.homeDarkColor,
});

const shapeFriend = (friend: any) => ({
  isReady: true,
  user: friend?.user,
  id: friend?.id,
  name: friend?.name,
  last_name: friend?.last_name,
  next_meet: friend?.next_meet,
  saved_color_dark: friend?.saved_color_dark,
  saved_color_light: friend?.saved_color_light,
  theme_color_dark: friend?.theme_color_dark,
  theme_color_light: friend?.theme_color_light,
  theme_color_font: friend?.theme_color_font,
  theme_color_font_secondary: friend?.theme_color_font_secondary,
  suggestion_settings: friend?.suggestion_settings,
  created_on: friend?.created_on,
  updated_on: friend?.updated_on,
  ...safeColors(friend),
});

export const useSelectedFriend = () => {
  const queryClient = useQueryClient();

  const { data: selectedFriend } = useQuery(selectedFriendQueryOptions);

  const selectFriend = useCallback((friend) => {
    queryClient.setQueryData(SELECTED_FRIEND_KEY, friend);
  }, [queryClient]);

  const setToFriend = useCallback(({ friend, preConditionsMet }) => {
    if (!preConditionsMet) {
      queryClient.setQueryData(SELECTED_FRIEND_KEY, { ...DEFAULT_FRIEND, isReady: false });
      return;
    }
    if (!friend?.id) {
      queryClient.setQueryData(SELECTED_FRIEND_KEY, DEFAULT_READY_NO_FRIEND);
      return;
    }
    queryClient.setQueryData(SELECTED_FRIEND_KEY, shapeFriend(friend));
  }, [queryClient]);

  const handleSetTheme = useCallback(({ lightColor, darkColor, fontColor, fontColorSecondary }) => {
    const current = queryClient.getQueryData(SELECTED_FRIEND_KEY);
    queryClient.setQueryData(SELECTED_FRIEND_KEY, {
      ...current,
      lightColor: lightColor ?? manualGradientColors.lightColor,
      darkColor: darkColor ?? manualGradientColors.darkColor,
      fontColor: fontColor ?? manualGradientColors.homeDarkColor,
      fontColorSecondary: fontColorSecondary ?? manualGradientColors.homeDarkColor,
    });
  }, [queryClient]);

  const deselectFriend = useCallback(() => {
    queryClient.setQueryData(SELECTED_FRIEND_KEY, DEFAULT_READY_NO_FRIEND);
  }, [queryClient]);

  const resetFriend = useCallback(() => {
    queryClient.setQueryData(SELECTED_FRIEND_KEY, DEFAULT_FRIEND);
  }, [queryClient]);

  const updateSelectedFriendName = useCallback((name: string) => {
    const current = queryClient.getQueryData(SELECTED_FRIEND_KEY);
    if (!current?.id) return;
    queryClient.setQueryData(SELECTED_FRIEND_KEY, { ...current, name });
  }, [queryClient]);

  const friend = selectedFriend ?? DEFAULT_FRIEND;

  return useMemo(() => ({
    selectedFriend: friend,
    selectFriend,
    updateSelectedFriendName,
    setToFriend,
    handleSetTheme,
    deselectFriend,
    resetFriend,
  }), [friend, selectFriend, setToFriend, handleSetTheme, deselectFriend, resetFriend, updateSelectedFriendName]);
};