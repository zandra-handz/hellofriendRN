 
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";

const useDeselectFriend = ({ userId, settings }) => {
  const queryClient = useQueryClient();
  const { selectedFriend, setToFriend, deselectFriend } = useSelectedFriend();
  const { updateSettings } = useUpdateSettings({ userId });
  const { friendListAndUpcoming } = useFriendListAndUpcoming({ userId });

  const friendList = friendListAndUpcoming?.friends;
  const friendId = selectedFriend?.id;

  const findFriendInList = (id) => {
    if (!friendList?.length || !id) return null;
    return friendList.find((friend) => friend.id === id) ?? null;
  };

  const handleDeselectFriend = useCallback(() => {
    if (!friendId || !settings) return false;

    const pinnedFriend = settings.pinned_friend;
    const upcomingFriend = settings.upcoming_friend;

    const pinnedFriendObj = findFriendInList(pinnedFriend);
    const upcomingFriendObj = findFriendInList(upcomingFriend);

    // If there's a pinned friend and an upcoming friend, clear pinned and switch to upcoming
    if (pinnedFriend && upcomingFriend) {
      setToFriend({ friend: upcomingFriendObj, preConditionsMet: true });

      queryClient.setQueryData(["userSettings", userId], (oldData) => {
        if (!oldData) return { pinned_friend: null };
        return { ...oldData, pinned_friend: null };
      });

      updateSettings({ pinned_friend: null });
      return false;
    }

    // If current friend is the upcoming friend, turn off auto-select
    if (upcomingFriend && Number(friendId) === Number(upcomingFriend)) {
      console.log("TURN AUTO OFF", friendId, upcomingFriend);
      deselectFriend();

      queryClient.setQueryData(["userSettings", userId], (oldData) => {
        if (!oldData) return { upcoming_friend: null };
        return { ...oldData, upcoming_friend: null };
      });

      updateSettings({ upcoming_friend: null });
      return true;
    }

    // If there's a pinned friend and current is not pinned, switch to pinned
    if (pinnedFriend && Number(friendId) !== Number(pinnedFriend)) {
      setToFriend({ friend: pinnedFriendObj, preConditionsMet: true });
      return false;
    }

    console.log("Fallback deselect");
    deselectFriend();
    return true;
  }, [userId, friendId, settings, friendList, queryClient, setToFriend, deselectFriend, updateSettings]);

  return { handleDeselectFriend };
};

export default useDeselectFriend;