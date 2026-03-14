// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { showFlashMessage } from "../utils/ShowFlashMessage";
import { deleteFriend } from "@/src/calls/api";

type Props = {
  userId: number;
  removeFromFriendList: () => void; // the hook for adding to the friendList cache
  refetchUpcoming: () => void; //hook for refetching
};

const useDeleteFriend = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const handleDeleteFriend = async ({ friendId, friendName }) => {
    try {
      await deleteFriendMutation.mutateAsync({ friendId, friendName });
    } catch (error) {
      console.error("Error deleting new friend in RQ function: ", error);
    }
  };

  const deleteFriendMutation = useMutation({
    mutationFn: ({ friendId, friendName }) => deleteFriend(friendId), // Pass friendId and imageId
    onSuccess: (data, variables) => {
      showFlashMessage(`${variables.friendName} deleted`, false, 1000);
      queryClient.refetchQueries({
        queryKey: ["friendListAndUpcoming", userId],
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        deleteFriendMutation.reset();
      }, 2000);
    },
    onError: (error, variables) => {
      showFlashMessage(`${variables.friendName} not deleted`, true, 1000);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      console.error("Error deleting friend:", error);
      timeoutRef.current = setTimeout(() => {
        deleteFriendMutation.reset();
      }, 2000);
    },
  });

  return {
    handleDeleteFriend,
    deleteFriendMutation,
  };
};

export default useDeleteFriend;
