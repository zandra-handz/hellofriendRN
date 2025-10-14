import { View, Text } from "react-native";
import React from "react";
import { Friendlite } from "../types/FriendTypes";
import { useFriendStyle } from "../context/FriendStyleContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
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

// for manual selects
const useSelectFriend = ({
  friendList,

  navigateOnSelect,
}: Props) => {
  const { selectFriend } = useSelectedFriend();
  const { getThemeAheadOfLoading } = useFriendStyle();

  const handleSelectFriend = (friendId) => {
    if (!friendList || friendList?.length < 1) {
      return;
    }

    const selectedOption = friendList?.find(
      (friend) => friend.id === Number(friendId)
    );

    const selectedFriend = selectedOption || null;
    // console.log(selectedFriend);
    if (selectedOption) {
      if (navigateOnSelect) {
        navigateOnSelect();
      }
      selectFriend(selectedFriend);
      getThemeAheadOfLoading(selectedFriend);
    }
  };

  return { handleSelectFriend };
};

export default useSelectFriend;
