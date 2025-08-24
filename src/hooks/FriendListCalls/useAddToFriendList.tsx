import { View, Text } from "react-native";
import React from "react";
import {   useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";

type Props = {
  userId: number;
};

const useAddToFriendList = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const addToFriendList = (newFriend: Friend) => {
    queryClient.setQueryData<Friend[]>(["friendList", userId], (old = []) => {
      const isAlreadyFriend = old.some((friend) => friend.id === newFriend.id);
      if (!isAlreadyFriend) {
        return [...old, newFriend];
      }
      return old;
    });
  };

  return { addToFriendList };
};

export default useAddToFriendList;
