
import { useCallback } from "react";
import { Friendlite } from "../types/FriendTypes";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { prefetchFriendDash } from "./prefetchFriendDashUtil";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
  friendList: Friendlite[];
  navigateOnSelect?: () => void;
};

// for manual selects
const useSelectFriend = ({
  userId,
  friendList,
  navigateOnSelect,
}: Props) => {
  const queryClient = useQueryClient();
  const { setToFriend } = useSelectedFriend();

  const handleSelectFriend = useCallback((friendId: number) => {
    // console.log("handle SELECT FRIEND", friendId);

    if (!friendList || friendList?.length < 1) {
      return;
    }

    const selectedFriend = friendList?.find(
      (friend) => friend.id === Number(friendId)
    ) || null;

    if (!selectedFriend) {
      return;
    }

    // Prefetch dashboard in background
    prefetchFriendDash(userId, selectedFriend.id, queryClient);

    // Navigate
    if (navigateOnSelect) {
      navigateOnSelect();
    }

    // Set friend state
    setToFriend({ friend: selectedFriend, preConditionsMet: true });
  }, [userId, friendList, navigateOnSelect, queryClient ]);

 

  return { handleSelectFriend };
};

export default useSelectFriend;