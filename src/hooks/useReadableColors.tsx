import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";

// import tinycolor from "tinycolor2";


//friendList object
export interface Friend {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  first_meet_entered: string;
  next_meet: number;
  user: number;

  created_on: string;
  updated_on: string;

  saved_color_dark: string;
  saved_color_light: string;
  theme_color_dark: string;
  theme_color_light: string;
  theme_color_font: string;
  theme_color_font_secondary: string;

  suggestion_settings: number;
}


const useReadableColors = (friendList: Friend[], selectedFriendId) => {
  const getSavedColorTheme = () => {
    const currentFriend = friendList.find(
      (friend) => friend.id === selectedFriendId
    );

    if (!currentFriend) {
      return;
    }
    return {
      savedDarkColor: currentFriend.saved_color_dark,
      savedLightColor: currentFriend.saved_color_light,
    };
  };

  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;
    return targetColor;

    // if (
    //   !tinycolor.isReadable(baseColor, targetColor, {
    //     level: "AA",
    //     size: "small",
    //   })
    // ) {
    //   fontColor = isInverted ? "white" : "black";

    //   if (
    //     !tinycolor.isReadable(baseColor, fontColor, {
    //       level: "AA",
    //       size: "small",
    //     })
    //   ) {
    //     fontColor = fontColor === "white" ? "black" : "white";
    //   }
    // }

    // return fontColor;
  };

    const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor;

    return fontColorSecondary;
  
    // if (!tinycolor.isReadable(targetColor, baseColor, { level: 'AA', size: 'small' })) {
    //   fontColorSecondary = isInverted ? 'black' : 'white';
  
    //   if (!tinycolor.isReadable(targetColor, fontColorSecondary, { level: 'AA', size: 'small' })) {
       
    //     fontColorSecondary = fontColorSecondary === 'black' ? 'white' : 'black';
    //   }
    // }
  
    // return fontColorSecondary; 
  };
  

  return {

    getSavedColorTheme,
    getFontColor,
    getFontColorSecondary,

  };
};

export default useReadableColors;
