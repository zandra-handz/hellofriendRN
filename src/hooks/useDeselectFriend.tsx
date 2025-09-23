import { View, Text } from "react-native";
import React from "react";
import { Friendlite } from "../types/FriendTypes";

type Props = {
  // lockInNext: boolean;
  // lockInCustomString: string;
  //   friendList: Friendlite[];
  resetTheme: () => void;
  //   getThemeAheadOfLoading: () => void;
  selectFriend: () => void;
  //   actionOnDeselect?: () => void;
  //   actionOnFail?: () => void;
};

// only currenly used in three places
const useDeselectFriend = ({
  resetTheme,
  selectFriend,
  updateSettings,
  lockIns, // .next and .customString, if .next is false and customString is empty, don't make the api call
}: Props) => {
  const handleDeselectFriend = () => {
    // if (!friendList || friendList?.length < 1) {
    //   console.log("returning");
    //   return;
    // }
    // const selectedOption = friendList?.find((friend) => friend.id === friendId);

    // const selectedFriend = selectedOption || null;
    // if (selectedOption) {
    //   selectFriend(selectedFriend);
    //   getThemeAheadOfLoading(selectedFriend);

    //   if (navigateOnSelect) {
    //     console.log('navigating back')
    //     navigateOnSelect();
    //   }
    // } else {
    selectFriend(null);
    resetTheme();
    if (updateSettings && lockIns?.customString) {
      console.log('resetting lockin');
      updateSettings({ lock_in_custom_string: null });
    } else {
      console.log('no api call')
    }

    //   if (actionOnDeselect) {
    //     actionOnDeselect();
    //   }
    // }

    // if (navigationAction) {
    //   navigateAction();
    // }
  };

  return { handleDeselectFriend };
};

export default useDeselectFriend;
