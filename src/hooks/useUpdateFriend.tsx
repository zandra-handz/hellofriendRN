// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFriendSugSettings } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
  refetchUpcoming?: () => void;
};

const useUpdateFriend = ({ userId, friendId, refetchUpcoming }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const updateFriendSettingsMutation = useMutation({
    mutationFn: (data) => updateFriendSugSettings(data),
    onSuccess: (data) => {
      console.log("Friend suggestion settings updated successfully.", data);
      queryClient.setQueryData(
        ["friendDashboardData", userId, friendId],
        (old) => {
          if (!old) return old; // if cache is empty, just bail

          return {
            ...old,
            suggestion_settings: data, // <-- your new data
          };
        }
      );
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

  const handleUpdateFriendSettings = async ({
    effort,
    priority,
    phoneNumber,
  }) => {
    const update = {
      user: userId,
      friend: friendId,
      effort_required: effort,
      priority_level: priority,
      phone_number: phoneNumber,
    };

    console.log("Payload in RQ function before sending:", update);

    try {
      await updateFriendSettingsMutation.mutateAsync(update); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving new friend in RQ function: ", error);
    }
  };

  const handleNewFriendSettings = async ({
    friendId,
    effort,
    priority,
    phoneNumber,
  }) => {
    const update = {
      user: userId,
      friend: friendId,
      effort_required: effort,
      priority_level: priority,
      phone_number: phoneNumber,
    };

    console.log("Payload in RQ function before sending:", update);

    try {
      await newFriendSettingsMutation.mutateAsync(update); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving new friend in RQ function: ", error);
    }
  };


    const newFriendSettingsMutation = useMutation({
    mutationFn: (data) => updateFriendSugSettings(data),
    onSuccess: (data) => {
      console.log("Friend suggestion settings updated successfully.", data);
 
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


  return {
    handleNewFriendSettings,
    handleUpdateFriendSettings,
    updateFriendSettingsMutation,
  };
};

export default useUpdateFriend;
