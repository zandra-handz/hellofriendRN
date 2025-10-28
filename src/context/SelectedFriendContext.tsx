import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { Friend } from "../types/FriendTypes";
import manualGradientColors from "@/app/styles/StaticColors";

// import { useUser } from "./UserContext";

interface SelectedFriendType {
  selectedFriend: Friend | null;
  deselectFriend: () => void;
  selectFriend: (friend: Friend | null) => void; //setting as null will deselect, hence why it's allowed (was already an established approach)
}

const SelectedFriendContext = createContext<SelectedFriendType | undefined>(
  undefined
);

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);

  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendProvider"
    );
  }
  return context;
};

interface SelectedFriendProviderProps {
  children: React.ReactNode;
}

export const SelectedFriendProvider: React.FC<SelectedFriendProviderProps> = ({
  children,
}) => {

  // const { user, isInitializing } = useUser();

  console.log('FRIENDS RERENDERED')

  // moved to welcome screen
  // useEffect(() => {
  //   if (!isInitializing && !user?.id) {
  //     console.log('resetting friend')
  //     resetFriend();
  //   }

  // }, [user?.id, isInitializing]);
  // console.log('SELECTED FRIEND RERENDERED   !!!!!!!!!!!!!!!!!!!!!!!!             !!!!!!!!!!!!!!!!!!!!!')
  const [selectedFriend, setSelectedFriend] = useState<Friend>({
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
    fontColor: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
    fontColorSecondary: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
  });

  const selectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    // console.log("FRIEND: ", friend);
    // console.log("selecting friend in context");
  };

  const setToAutoFriend = ({ friend, preConditionsMet }) => {
    console.log("FRIEND PASSED TO AUTO: ", friend);
    if (!preConditionsMet) {
      const notReady = {
        id: null,
        isReady: false,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(notReady);
      return;
    }
    if (!friend?.id) {
      const notReady = {
        id: null,
        isReady: true,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(notReady);
      return;
    }

    if (preConditionsMet && !friend?.id) {
      const isReady = {
        id: null,
        isReady: true,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(isReady);
    }

    const fromAuto = {
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

      darkColor: friend?.theme_color_dark,
      lightColor: friend?.theme_color_light,
      fontColor: friend?.theme_color_font,
      fontColorSecondary: friend?.theme_color_font_secondary,
    };

    selectFriend(fromAuto);
  };

  const setToFriend = ({ friend, preConditionsMet }) => {
    if (!preConditionsMet || !friend?.id) {
      const notReady = {
        id: null,
        isReady: false,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(notReady);
      return;
    }
 

    const fromFriendlist = {
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

      darkColor: friend?.theme_color_dark,
      lightColor: friend?.theme_color_light,
      fontColor: friend?.theme_color_font,
      fontColorSecondary: friend?.theme_color_font_secondary,
    };

    selectFriend(fromFriendlist);
  };

  // type handleSetThemeProps = {
  //   lightColor: string;
  //   darkColor: string;
  //   fontColor: string;
  //   fontColorSecondary: string;
  // };

  const handleSetTheme = ({
    lightColor,
    darkColor,
    fontColor,
    fontColorSecondary,
  } ) => {
    setSelectedFriend((prev) => ({
      ...prev,
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    }));
  };

  const deselectFriend = () => {
    setSelectedFriend({
      isReady: true,
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
      fontColor: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
      fontColorSecondary: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
    });
  };

  // for logging out
  const resetFriend = () => {
    setSelectedFriend({
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
      fontColor: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
      fontColorSecondary: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
    });
  };

  const contextValue = useMemo(
    () => ({
      selectedFriend,
      selectFriend,
      deselectFriend,
      setToFriend,
      setToAutoFriend,
      handleSetTheme,
      resetFriend,
    }),
    [
      selectedFriend,
      selectFriend,
      deselectFriend,
      setToFriend,
      setToAutoFriend,
      handleSetTheme,
      resetFriend,
    ]
  );

  return (
    <SelectedFriendContext.Provider value={contextValue}>
      {children}
    </SelectedFriendContext.Provider>
  );
};
