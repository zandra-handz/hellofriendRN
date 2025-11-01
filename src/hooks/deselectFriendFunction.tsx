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
  updateSettings,
  friendId, 
  autoSelectFriend,
 
  setToFriend,
  deselectFriend,
}) => {
  if (!updateSettings || !friendId || !autoSelectFriend) {
    return;
  }

 
  if (
    autoSelectFriend?.customFriend === 'pending' ||
    autoSelectFriend?.nextFriend === 'pending'
  ) {
    console.log("autos not ready yet...");
    // selectFriend(null);
    // resetTheme(null);
    return;
  }

  if (autoSelectFriend?.customFriend?.id && autoSelectFriend.customFriend?.id !== -1 && autoSelectFriend.nextFriend?.id && autoSelectFriend?.nextFriend?.id !== -1) {
 
    setToFriend({friend: autoSelectFriend?.nextFriend, preConditionsMet: true});
 

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
    autoSelectFriend?.nextFriend?.id && autoSelectFriend?.nextFriend?.id !== -1 &&
    Number(friendId) === Number(autoSelectFriend?.nextFriend?.id)
  ) {
    // console.log("TURN AUTO OFF", friendId, autoSelectFriend?.nextFriend?.id);
    deselectFriend();
  

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
    autoSelectFriend?.customFriend?.id && autoSelectFriend?.customFriend?.id !== -1 &&
    Number(friendId) !== Number(autoSelectFriend?.customFriend?.id)
  ) {
    setToFriend({friend: autoSelectFriend?.customFriend, preConditionsMet: true});
 

    return;
  }

  deselectFriend();
 
  return;
};
