import { View, Text } from "react-native";
import React from "react";
import { Friendlite } from "../types/FriendTypes"; 
import { useSelectedFriend } from "../context/SelectedFriendContext";
// import useFriendDash from "./useFriendDash";
import { prefetchFriendDash } from "./prefetchFriendDashUtil";

import { useQueryClient } from "@tanstack/react-query";



type Props = {
  // lockInNext: boolean;
  // lockInCustomString: string;
  friendList: Friendlite[]; 
  navigateOnSuccess?: () => void;
  actionOnFail?: () => void;
};



// for manual selects
const useSelectFriend = ({
  userId,
  friendList,

  navigateOnSelect,
}: Props) => {
  const queryClient = useQueryClient();
  const {  setToFriend } = useSelectedFriend();
 

  const handleSelectFriend = (friendId) => {

    console.log('handle SELECT FRIEND', friendId)
 
    if (!friendList || friendList?.length < 1) {
      return;
    }

    const selectedOption = friendList?.find(
      (friend) => friend.id === Number(friendId)
    );

    const selectedFriend = selectedOption || null;

    // if (selectedFriend) {
    //   prefetchFriendDash(userId, selectedFriend?.id, queryClient).catch(console.error);
    // }
 
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
