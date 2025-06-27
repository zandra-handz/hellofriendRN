import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";

import tinycolor from "tinycolor2";

const useReadableColors = (friendList, selectedFriend) => {
  const getSavedColorTheme = () => {
    const currentFriend = friendList.find(
      (friend) => friend.id === selectedFriend.id
    );
    return {
      savedDarkColor: currentFriend.savedDarkColor,
      savedLightColor: currentFriend.savedLightColor,
    };
  };

  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;

    if (
      !tinycolor.isReadable(baseColor, targetColor, {
        level: "AA",
        size: "small",
      })
    ) {
      fontColor = isInverted ? "white" : "black";

      if (
        !tinycolor.isReadable(baseColor, fontColor, {
          level: "AA",
          size: "small",
        })
      ) {
        fontColor = fontColor === "white" ? "black" : "white";
      }
    }

    return fontColor;
  };

    const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor;
  
    if (!tinycolor.isReadable(targetColor, baseColor, { level: 'AA', size: 'small' })) {
      fontColorSecondary = isInverted ? 'black' : 'white';
  
      if (!tinycolor.isReadable(targetColor, fontColorSecondary, { level: 'AA', size: 'small' })) {
       
        fontColorSecondary = fontColorSecondary === 'black' ? 'white' : 'black';
      }
    }
  
    return fontColorSecondary; 
  };
  

  return {

    getSavedColorTheme,
    getFontColor,
    getFontColorSecondary,

  };
};

export default useReadableColors;
