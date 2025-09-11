// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation  } from "@tanstack/react-query";

import { createFriend } from "@/src/calls/api";

const useCreateFriend = ({
  saveSettings,
  addToFriendList,
  refetchUpcoming,
  selectFriend,
}) => { 

  const timeoutRef = useRef(null);

  const handleCreateFriend = async (data) => {
    const friend = {
      name: data.name,
      first_name: data.first_name,
      last_name: data.last_name,
      first_meet_entered: data.first_meet_entered,
    };

    // console.log("Payload in RQ function before sending:", friend);

    try {
      await createFriendMutation.mutateAsync({
        ...friend,
        effort_required: data.effort_required,
        priority_level: data.priority_level,
      });
    } catch (error) {
      console.error("Error saving new friend in RQ function: ", error);
    }
  };

  const createFriendMutation = useMutation({
    mutationFn: (data) => createFriend(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createFriendMutation.reset();
      }, 2000);
    },
    onSuccess: (data, variables) => { 

      const { effort_required, priority_level } = variables;
      const friendId = data?.id;

      if (friendId) {
        saveSettings({friendId: friendId, effort: effort_required, priority: priority_level});
        addToFriendList(data);
        refetchUpcoming();
        selectFriend(data);
      }
    },
    onError: (error) => {
      console.error("Error deleting friend in mutation function: ", error);
    },
  });

  return {
    handleCreateFriend,
    createFriendMutation,
  };
};

export default useCreateFriend;
