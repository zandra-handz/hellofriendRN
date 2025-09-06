// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
 

import { updateFriendSugSettings } from "@/src/calls/api";

type Props = {
  userId: number;
  refetchUpcoming?: () => void;
};

const useUpdateFriend = ({ userId, refetchUpcoming }: Props) => {
 

  const timeoutRef = useRef(null);

  const updateFriendSettingsMutation = useMutation({
    mutationFn: (data) => updateFriendSugSettings(data),
    onSuccess: () => {
      console.log("Friend suggestion settings updated successfully.");
      if (refetchUpcoming) {
        refetchUpcoming();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendSettingsMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Error updating friend suggestion settings: ", error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendSettingsMutation.reset();
      }, 2000);
    },
  });

  const handleUpdateFriendSettings = async (
    friendId,
    effort,
    priority,
    phoneNumber
  ) => {
    const update = {
      user: userId,
      friend: friendId,
      effort_required: effort,
      priority_level: priority,
      phone_number: phoneNumber,
    };

    //console.log("Payload in RQ function before sending:", update);

    try {
      await updateFriendSettingsMutation.mutateAsync(update); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving new friend in RQ function: ", error);
    }
  };

  return {
    handleUpdateFriendSettings,
    updateFriendSettingsMutation,
  };
};

export default useUpdateFriend;
