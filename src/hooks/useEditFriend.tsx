import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/src/types/FriendTypes";
import { editFriend } from "@/src/calls/api";

import { useSelectedFriend } from "../context/SelectedFriendContext";

type Props = {
  userId: number;
  friendId: number;
};

type EditFriendArgs = {
  name: string;
  firstName?: string;
  lastName?: string;
};

type EditFriendPayload = {
  user: number;
  friend: number;
  name: string;
  first_name?: string;
  last_name?: string;
};

type FriendListCache = {
  friends: Friend[];
  upcoming: any[];
  next?: Friend;
};

const useEditFriend = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { updateSelectedFriendName } = useSelectedFriend();

  const handleEditFriend = async ({
    name,
    firstName, //not using 
    lastName, //not using
  }: EditFriendArgs) => {
    const update: EditFriendPayload = {
      user: userId,
      friend: friendId,
      name,
      first_name: firstName,
      last_name: lastName,
    };
    try {
      await editFriendMutation.mutateAsync(update);
    } catch (error) {
      console.error("Error editing new friend in RQ function: ", error);
    }
  };

  const editFriendMutation = useMutation<Friend, Error, EditFriendPayload>({
    mutationFn: (friendData) => editFriend(friendData),
    onSuccess: (data) => {
      console.log("edit friend response:", data.id);
      queryClient.setQueryData<FriendListCache>(
        ["friendListAndUpcoming", userId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            friends: old.friends.map((friend) =>
              friend.id === data.id ? { ...friend, name: data.name } : friend,
            ),
          };
        },
      );

     updateSelectedFriendName(data.name);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        editFriendMutation.reset();
      }, 2000);
    },
    onError: (error: Error) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      console.error("Error editing friend:", error);
      timeoutRef.current = setTimeout(() => {
        editFriendMutation.reset();
      }, 2000);
    },
  });

  return {
    handleEditFriend,
    editFriendMutation,
  };
};

export default useEditFriend;
