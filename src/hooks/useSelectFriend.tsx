import { View, Text } from "react-native";
import React from "react";
import { Friendlite } from "../types/FriendTypes";

type Props = {
  // lockInNext: boolean;
  // lockInCustomString: string;
  friendList: Friendlite[];
  resetTheme: () => void;
  getThemeAheadOfLoading: () => void;
  selectFriend: () => void;
  navigateOnSuccess?: () => void;
  actionOnFail?: () => void;
};

const useSelectFriend = ({
  // lockInNext,
  // lockInCustomString,
  friendList,
  resetTheme,
  getThemeAheadOfLoading,
  selectFriend,
  navigateOnSelect,
  actionOnNull,
}: Props) => {
  const handleSelectFriend = (friendId) => {
    if (!friendList || friendList?.length < 1) {
      console.log("returning");
      return;
    }
    const selectedOption = friendList?.find((friend) => friend.id === friendId);

    const selectedFriend = selectedOption || null;
    if (selectedOption) {
      selectFriend(selectedFriend);
      getThemeAheadOfLoading(selectedFriend);
     
      if (navigateOnSelect) {
        console.log('navigating back')
        navigateOnSelect();
      }
    } else {
      selectFriend(null);
      resetTheme();

      if (actionOnNull) {
        actionOnNull();
      }
    }

    // if (navigationAction) {
    //   navigateAction();
    // }
  };

  return { handleSelectFriend };
};

export default useSelectFriend;
