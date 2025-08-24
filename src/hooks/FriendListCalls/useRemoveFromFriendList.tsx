import { View, Text } from "react-native";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";

type Props = {
  userId: number;
};

const useRemoveFromFriendList = ({ userId }: Props) => {
  const queryClient = useQueryClient();

const removeFromFriendList = (friendIdToRemove: number | number[]) => {
  queryClient.setQueryData<Friend[]>(["friendList", userId], (old = []) => {
    const idsToRemove = Array.isArray(friendIdToRemove)
      ? friendIdToRemove
      : [friendIdToRemove];
    return old.filter((friend) => !idsToRemove.includes(friend.id));
  });
};
  return { removeFromFriendList };
};

export default useRemoveFromFriendList;
