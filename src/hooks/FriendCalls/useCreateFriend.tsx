// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFriend, updateFriendSugSettings } from "@/src/calls/api";
 

type Props = {
  userId: number;
};

const useCreateFriend = ({ userId, selectFriend }: Props) => {
  const timeoutRef = useRef(null);
  const queryClient = useQueryClient();

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
        console.log("SAVING FRIEND SETTINGS!!!");
        handleNewFriendSettings({
          friendId: friendId,
          effort: effort_required,
          priority: priority_level,
        });

        // selectFriend(data);
      }
    },
    onError: (error) => {
      console.error("Error deleting friend in mutation function: ", error);
    },
  });

  const newFriendSettingsMutation = useMutation({
    mutationFn: (data) => updateFriendSugSettings(data),
    onSuccess: async (data) => {
      console.log(
        "Friend suggestion settings updated successfully. Refetching friendListAndUpcoming...",
        data,
      );

      await queryClient.refetchQueries({
        queryKey: ["friendListAndUpcoming", userId],
      });

      await queryClient.refetchQueries({ queryKey: ["userSettings", userId] });

      queryClient.setQueryData(
        ["autoSelectTrigger"],
        (old: number = 0) => old + 1,
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        newFriendSettingsMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Error updating friend suggestion settings: ", error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        newFriendSettingsMutation.reset();
      }, 2000);
    },
  });

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

  return {
    handleCreateFriend,
    createFriendMutation,
    // handleNewFriendSettings,
    newFriendSettingsMutation,
  };
};

export default useCreateFriend;
