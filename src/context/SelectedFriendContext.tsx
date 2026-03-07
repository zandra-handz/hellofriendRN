
// import React, { createContext, useState, useContext, useMemo } from "react";
// import { Friend } from "../types/FriendTypes";
// import manualGradientColors from "@/app/styles/StaticColors";

// interface SelectedFriendType {
//   selectedFriend: Friend | null;
//   deselectFriend: () => void;
//   selectFriend: (friend: Friend | null) => void;
// }

// const SelectedFriendContext = createContext<SelectedFriendType | undefined>(undefined);

// export const useSelectedFriend = () => {
//   const context = useContext(SelectedFriendContext);
//   if (!context) {
//     throw new Error("useSelectedFriend must be used within a SelectedFriendProvider");
//   }
//   return context;
// };

// // Centralized fallback — any null color gets replaced with the default
// const safeColors = (friend: any) => ({
//   darkColor: friend?.theme_color_dark ?? manualGradientColors.darkColor,
//   lightColor: friend?.theme_color_light ?? manualGradientColors.lightColor,
//   fontColor: friend?.theme_color_font ?? manualGradientColors.homeDarkColor,
//   fontColorSecondary: friend?.theme_color_font_secondary ?? manualGradientColors.homeDarkColor,
// });

// const DEFAULT_NOT_READY = {
//   id: null,
//   isReady: false,
//   lightColor: manualGradientColors.lightColor,
//   darkColor: manualGradientColors.darkColor,
//   fontColor: manualGradientColors.homeDarkColor,
//   fontColorSecondary: manualGradientColors.homeDarkColor,
// };

// const DEFAULT_READY_NO_FRIEND = {
//   id: null,
//   isReady: true,
//   lightColor: manualGradientColors.lightColor,
//   darkColor: manualGradientColors.darkColor,
//   fontColor: manualGradientColors.homeDarkColor,
//   fontColorSecondary: manualGradientColors.homeDarkColor,
// };

// const shapeFriend = (friend: any) => ({
//   isReady: true,
//   user: friend?.user,
//   id: friend?.id,
//   name: friend?.name,
//   last_name: friend?.last_name,
//   next_meet: friend?.next_meet,
//   saved_color_dark: friend?.saved_color_dark,
//   saved_color_light: friend?.saved_color_light,
//   theme_color_dark: friend?.theme_color_dark,
//   theme_color_light: friend?.theme_color_light,
//   theme_color_font: friend?.theme_color_font,
//   theme_color_font_secondary: friend?.theme_color_font_secondary,
//   suggestion_settings: friend?.suggestion_settings,
//   created_on: friend?.created_on,
//   updated_on: friend?.updated_on,
//   ...safeColors(friend), // always overrides with fallback-safe values
// });

// interface SelectedFriendProviderProps {
//   children: React.ReactNode;
// }

// export const SelectedFriendProvider: React.FC<SelectedFriendProviderProps> = ({ children }) => {
//   const [selectedFriend, setSelectedFriend] = useState<Friend>({
//     isReady: false,
//     user: null,
//     id: null,
//     name: null,
//     last_name: null,
//     next_meet: null,
//     saved_color_dark: null,
//     saved_color_light: null,
//     theme_color_dark: null,
//     theme_color_light: null,
//     theme_color_font: null,
//     theme_color_font_secondary: null,
//     suggestion_settings: null,
//     created_on: null,
//     updated_on: null,
//     lightColor: manualGradientColors.lightColor,
//     darkColor: manualGradientColors.darkColor,
//     fontColor: manualGradientColors.homeDarkColor,
//     fontColorSecondary: manualGradientColors.homeDarkColor,
//   });

//   const selectFriend = (friend: Friend) => {
//     setSelectedFriend(friend);
//   };

//   const setToAutoFriend = ({ friend, preConditionsMet }) => {
//     // console.log("FRIEND PASSED TO AUTO: ", friend);
//     if (!preConditionsMet) {
//       if (!selectedFriend?.id) {
//         selectFriend(DEFAULT_NOT_READY);
//       }
//       return;
//     }
//     if (!friend?.id) {
//       selectFriend(DEFAULT_READY_NO_FRIEND);
//       return;
//     }
//     selectFriend(shapeFriend(friend));
//   };

//   const setToFriend = ({ friend, preConditionsMet }) => {
//     if (!preConditionsMet || !friend?.id) {
//       if (!selectedFriend?.id) {
//         selectFriend(DEFAULT_NOT_READY);
//       }
//       return;
//     }
//     selectFriend(shapeFriend(friend));
//   };

//   const handleSetTheme = ({ lightColor, darkColor, fontColor, fontColorSecondary }) => {
//     setSelectedFriend((prev) => ({
//       ...prev,
//       lightColor: lightColor ?? manualGradientColors.lightColor,
//       darkColor: darkColor ?? manualGradientColors.darkColor,
//       fontColor: fontColor ?? manualGradientColors.homeDarkColor,
//       fontColorSecondary: fontColorSecondary ?? manualGradientColors.homeDarkColor,
//     }));
//   };

//   const deselectFriend = () => {
//     // console.log('DESELECT FRIEND RANNNNN')
//     setSelectedFriend({
//       isReady: true,
//       user: null,
//       id: null,
//       name: null,
//       last_name: null,
//       next_meet: null,
//       saved_color_dark: null,
//       saved_color_light: null,
//       theme_color_dark: null,
//       theme_color_light: null,
//       theme_color_font: null,
//       theme_color_font_secondary: null,
//       suggestion_settings: null,
//       created_on: null,
//       updated_on: null,
//       lightColor: manualGradientColors.lightColor,
//       darkColor: manualGradientColors.darkColor,
//       fontColor: manualGradientColors.homeDarkColor,
//       fontColorSecondary: manualGradientColors.homeDarkColor,
//     });
//   };

//   const resetFriend = () => {
//     setSelectedFriend({
//       isReady: false,
//       user: null,
//       id: null,
//       name: null,
//       last_name: null,
//       next_meet: null,
//       saved_color_dark: null,
//       saved_color_light: null,
//       theme_color_dark: null,
//       theme_color_light: null,
//       theme_color_font: null,
//       theme_color_font_secondary: null,
//       suggestion_settings: null,
//       created_on: null,
//       updated_on: null,
//       lightColor: manualGradientColors.lightColor,
//       darkColor: manualGradientColors.darkColor,
//       fontColor: manualGradientColors.homeDarkColor,
//       fontColorSecondary: manualGradientColors.homeDarkColor,
//     });
//   };

//   const contextValue = useMemo(
//     () => ({
//       selectedFriend,
//       selectFriend,
//       deselectFriend,
//       setToFriend,
//       setToAutoFriend,
//       handleSetTheme,
//       resetFriend,
//     }),
//     [selectedFriend]
//   );

//   return (
//     <SelectedFriendContext.Provider value={contextValue}>
//       {children}
//     </SelectedFriendContext.Provider>
//   );
// };


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

  const { data: selectedFriend } = useQuery({
    queryKey: SELECTED_FRIEND_KEY,
    queryFn: () => DEFAULT_FRIEND,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  // console.log('selected friend hook', Date.now())

  const selectFriend = useCallback((friend) => {
    queryClient.setQueryData(SELECTED_FRIEND_KEY, friend);
  }, [queryClient]);

  const setToAutoFriend = useCallback(({ friend, preConditionsMet }) => {
    const current = queryClient.getQueryData(SELECTED_FRIEND_KEY);
    if (!preConditionsMet) {
      if (!current?.id) {
        queryClient.setQueryData(SELECTED_FRIEND_KEY, { ...DEFAULT_FRIEND, isReady: false });
      }
      return;
    }
    if (!friend?.id) {
      queryClient.setQueryData(SELECTED_FRIEND_KEY, DEFAULT_READY_NO_FRIEND);
      return;
    }
    queryClient.setQueryData(SELECTED_FRIEND_KEY, shapeFriend(friend));
  }, [queryClient]);

  const setToFriend = useCallback(({ friend, preConditionsMet }) => {
    const current = queryClient.getQueryData(SELECTED_FRIEND_KEY);
    if (!preConditionsMet || !friend?.id) {
      if (!current?.id) {
        queryClient.setQueryData(SELECTED_FRIEND_KEY, { ...DEFAULT_FRIEND, isReady: false });
      }
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

  const friend = selectedFriend ?? DEFAULT_FRIEND;

  return useMemo(() => ({
    selectedFriend: friend,
    selectFriend,
    setToAutoFriend,
    setToFriend,
    handleSetTheme,
    deselectFriend,
    resetFriend,
  }), [friend, selectFriend, setToAutoFriend, setToFriend, handleSetTheme, deselectFriend, resetFriend]);
};