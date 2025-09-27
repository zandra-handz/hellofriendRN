import { View, Text } from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  settings,
  updateSettings,
  friendId,
  upNextId,
  autoSelectId,
  friendList,
  selectFriend,
  resetTheme,
  getThemeAheadOfLoading,
}) => {
  if (!updateSettings || !friendId) {
    return;
  }
  //   if (updateSettings && friendId && autoSelectId) {
  if (autoSelectId) {
    // If deselecting the auto next. CUSTOM WILL ALWAYS TAKE PRECEDENCE OVER NEXT.
    // so if autoSelectId is the nextUpId, it means there is no custom
    // wiping it again here anyway for a visual of what backend should look like after this
    if (autoSelectId === upNextId && upNextId === friendId) {
      console.log(`upNextId: `, upNextId);
      console.log(`friendId: `, friendId);
      let updatesCaseOne = { lock_in_custom_string: null, lock_in_next: false };
      console.log("updates");

      queryClient.setQueryData(["userSettings", userId], (oldData: any) => {
        if (!oldData) return { ...updatesCaseOne }; // fallback if cache is empty
        return {
          ...oldData, // preserve existing fields
          ...updatesCaseOne, // apply only the fields we want to change
        };
      });

      //   const cachedSettings = queryClient.getQueryData(["userSettings", userId]);

      //   console.log("Current cached settings:", cachedSettings);

      await updateSettings({
        lock_in_custom_string: null,
        lock_in_next: false,
      }); //custom string here is just to be safe
      console.log("about to deselect");
      selectFriend(null);
      resetTheme();

      //if deselecting the auto custom
    } else if (autoSelectId === friendId) {
      let updates = { lock_in_custom_string: null, lock_in_next: true };

      queryClient.setQueryData(["userSettings", userId], (oldData: any) => {
        if (!oldData) return { ...updates };
        return {
          ...oldData,
          ...updates,
        };
      });

      await updateSettings({ lock_in_custom_string: null, lock_in_next: true }); //next up here is just to be safe
      if (upNextId) {
        let friendToSelect;
        friendToSelect = findFriendInList(upNextId, friendList);
        if (friendToSelect) {
          selectFriend(friendToSelect);
          getThemeAheadOfLoading(friendToSelect);
        }
      }

      // deselecting NON custom when auto is turned on
    } else if (autoSelectId === upNextId) {
      let updatesCaseThree = {
        lock_in_custom_string: null,
        lock_in_next: true,
      };

      queryClient.setQueryData(["userSettings", userId], (oldData: any) => {
        if (!oldData) return { ...updatesCaseThree };
        return {
          ...oldData,
          ...updatesCaseThree,
        };
      });

      await updateSettings({ lock_in_custom_string: null, lock_in_next: true }); //next up here is just to be safe
      if (upNextId) {
        console.log("up next id!!!");
        let friendToSelect;
        friendToSelect = findFriendInList(upNextId, friendList);
        if (friendToSelect) {
          selectFriend(friendToSelect);
          getThemeAheadOfLoading(friendToSelect);
        }
      }
    }

    // if no autoSelectId, deselect is just a true deselect with no backend call
  } else {
    selectFriend(null);
    resetTheme();
  }
};
