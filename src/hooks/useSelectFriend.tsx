import { View, Text } from "react-native";
import React from "react";
import { Friendlite } from "../types/FriendTypes"; 
import { useSelectedFriend } from "../context/SelectedFriendContext";
type Props = {
  // lockInNext: boolean;
  // lockInCustomString: string;
  friendList: Friendlite[]; 
  navigateOnSuccess?: () => void;
  actionOnFail?: () => void;
};

// for manual selects
const useSelectFriend = ({
  friendList,

  navigateOnSelect,
}: Props) => {
  const {  setToFriend } = useSelectedFriend();
 

  const handleSelectFriend = (friendId) => {
 
    if (!friendList || friendList?.length < 1) {
      return;
    }

    const selectedOption = friendList?.find(
      (friend) => friend.id === Number(friendId)
    );

    const selectedFriend = selectedOption || null;
 
    if (selectedOption) {
      if (navigateOnSelect) {
   
        navigateOnSelect();
      }
      setToFriend({friend: selectedFriend, preConditionsMet: true}); 
    }
  };

  return { handleSelectFriend };
};

export default useSelectFriend;
