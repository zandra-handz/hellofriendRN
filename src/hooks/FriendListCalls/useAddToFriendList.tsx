import { View, Text } from "react-native";
import React from "react";
import {   useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";

type Props = {
  userId: number;
};

const useAddToFriendList = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  // const addToFriendList = (newFriend: Friend) => {
  //   queryClient.setQueryData<Friend[]>(["friendListAndUpcoming", userId], (old = []) => {
  //     const isAlreadyFriend = old.some((friend) => friend.id === newFriend.id);
  //     if (!isAlreadyFriend) {
  //       return [...old, newFriend];
  //     }
  //     return old;
  //   });
  // };

  const addToFriendList = (newFriend: Friend) => {
  queryClient.setQueryData(
    ["friendListAndUpcoming", userId],
    (old: { friends?: Friend[]; upcoming?: any[]; next?: Friend } | undefined) => {
      if (!old) {
        return { friends: [newFriend], upcoming: [] };
      }

      const isAlreadyFriend = old.friends?.some(
        (friend) => friend.id === newFriend.id
      );

      if (isAlreadyFriend) {
        return old;  
      }

      return {
        ...old,
        friends: [...(old.friends ?? []), newFriend],
      };
    }
  );
};

  return { addToFriendList };
};

export default useAddToFriendList;
