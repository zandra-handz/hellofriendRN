import { View, Text } from "react-native";
import React from "react";
import {   useQueryClient, QueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";

 

 

  export function addToFriendList(queryClient: QueryClient, userId: number, newFriend: Friend) {
  queryClient.setQueryData(
    ["friendListAndUpcoming", userId],
    (old: { friends?: Friend[]; upcoming?: any[]; next?: Friend } | undefined) => {
      if (!old) {
        return { friends: [newFriend], upcoming: [], next: null };
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
 