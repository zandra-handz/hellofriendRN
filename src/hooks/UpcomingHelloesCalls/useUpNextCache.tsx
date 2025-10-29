import { View, Text } from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
};

const useUpNextCache = ({ userId, friendListAndUpcoming }: Props) => {
  const queryClient = useQueryClient();

  const setUpNextCache = () => {

    if (!friendListAndUpcoming?.length) {
      return;
    }
      if (friendListAndUpcoming?.upcoming?.length && friendListAndUpcoming?.friends?.length && userId) {
    const upcomingFriend = friendListAndUpcoming?.friends.find(
      (friend) => Number(friend.id) === Number(friendListAndUpcoming?.upcoming[0]?.friend?.id)
    );

    queryClient.setQueryData(["friendListAndUpcoming", userId], (old) => ({
      ...old,
      next: upcomingFriend,
    }));
  }
  };

  return { setUpNextCache };
};

export default useUpNextCache;
