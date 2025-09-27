import { View, Text } from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";

type Props = {
  userId: number;
};

const useUpdateFriend = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  // const updateFriend = (updatedFriend: Friend) => {
  //   queryClient.setQueryData<Friend[]>(["friendList", userId], (old = []) =>
  //     old.map((friend) =>
  //       friend.id === updatedFriend.id ? updatedFriend : friend
  //     )
  //   );
  // };
  const updateFriend = (updatedFriend: Friend) => {
    queryClient.setQueryData(
      ["friendListAndUpcoming", userId],
      (
        old: { friends: Friend[]; upcoming: any[]; next?: Friend } | undefined
      ) => {
        if (!old) return old;

        return {
          ...old,
          friends: old.friends.map((friend) =>
            friend.id === updatedFriend.id ? updatedFriend : friend
          ),
        };
      }
    );
  };

  return { updateFriend };
};

export default useUpdateFriend;
