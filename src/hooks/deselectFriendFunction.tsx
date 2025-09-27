import { View, Text } from "react-native";
import React from "react";
// import { useQueryClient } from "@tanstack/react-query";
export const findFriendInList = (id, friendList) => {
  if (!friendList?.length || id) {
    return;
  }
  return friendList?.find((friend) => friend.id === id);
};

//add hello deselect needs to be handled differently because the nextUpId might change
export const deselectFriendFunction = async ({
  userId,
  queryClient,
  // settings,
  updateSettings,
  friendId,
  // upNextId,
  // autoSelectId,
  autoSelectFriend,
  // friendList,
  selectFriend,
  resetTheme,
  getThemeAheadOfLoading,
}) => {
  if (!updateSettings || !friendId || !autoSelectFriend) {
    return;
  }

  if (
    autoSelectFriend?.customFriend === undefined &&
    autoSelectFriend?.nextFriend === undefined
  ) {
    console.log("autos not ready yet...");
    // selectFriend(null);
    // resetTheme(null);
    return;
  }

  if (autoSelectFriend?.customFriend?.id && autoSelectFriend?.nextFriend?.id) {
    console.log("TURN CUSTOM OFF", autoSelectFriend);
    console.log(autoSelectFriend?.nextFriend);
    selectFriend(autoSelectFriend?.nextFriend);
    getThemeAheadOfLoading(autoSelectFriend?.nextFriend);

    let autoToNext;
    autoToNext = { lock_in_custom_string: null };

    queryClient.setQueryData(["userSettings", userId], (oldData: any) => {
      if (!oldData) return { ...autoToNext };
      return {
        ...oldData,
        ...autoToNext,
      };
    });
    return;
  }

  if (
    autoSelectFriend?.nextFriend?.id &&
    Number(friendId) === Number(autoSelectFriend?.nextFriend?.id)
  ) {
    console.log("TURN AUTO OFF", friendId, autoSelectFriend?.nextFriend?.id);
    selectFriend(null);
    resetTheme(null);

    let autoOff;
    autoOff = { lock_in_next: false };

    queryClient.setQueryData(["userSettings", userId], (oldData: any) => {
      if (!oldData) return { ...autoOff };
      return {
        ...oldData,
        ...autoOff,
      };
    });
    return;
  }

  if (
    autoSelectFriend?.customFriend?.id &&
    Number(friendId) !== Number(autoSelectFriend?.customFriend?.id)
  ) {
    selectFriend(autoSelectFriend?.customFriend);
    getThemeAheadOfLoading(autoSelectFriend?.customFriend);

    return;
  }

  selectFriend(null);
  resetTheme(null);
  return;
};
