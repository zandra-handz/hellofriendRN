// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation  } from "@tanstack/react-query";
 
import {
  deleteFriend, 
} from "@/src/calls/api";

type Props = {
    removeFromFriendList: () => void, // the hook for adding to the friendList cache
    refetchUpcoming: () => void, //hook for refetching
}

const useDeleteFriend = ({ removeFromFriendList, refetchUpcoming} : Props) => {
 
  

  const timeoutRef = useRef(null);

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriendMutation.mutateAsync(friendId);
    } catch (error) {
      console.error("Error deleting new friend in RQ function: ", error);
    }
  };

  const deleteFriendMutation = useMutation({
    mutationFn: (friendId) => deleteFriend(friendId), // Pass friendId and imageId
    onSuccess: (data) => {
      console.log("deleted friend response:", data.id); 
      removeFromFriendList(data.id);

      refetchUpcoming();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteFriendMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.error("Error deleting friend:", error);
      // showMessage(true, null, 'Oops! Friend not deleted');
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
