import { View, Text } from "react-native";
import React, { useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeFromFriendFavesLocations } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useRemoveFromFaves = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);
  const queryClient = useQueryClient();
  const removeFromFavesMutation = useMutation({
    mutationFn: (data) => {
      return removeFromFriendFavesLocations(data);
    },
    onSuccess: (response) => {
      // setFriendFavesData(data.locations);

      console.log('removing from faves');

      queryClient.setQueryData( ["friendDashboardData", userId, friendId], (oldData: any[]) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            friend_faves: {
              ...oldData.friend_faves,
              locations: response.locations,
            },
            }
          }
        );
    }, 
    onError: (error) => {
      console.error("Error removing location to friend faves:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        removeFromFavesMutation.reset();
      }, 2000);
    },
  });

  const handleRemoveFromFaves = useCallback(
    async ({locationId}) => {
      if (!userId) {
        console.warn("No user logged in - cannot add to favorites");
        return;
      }

      // console.log(userId);
      // console.log(friendId);
      // console.log(locationId);
 
      try {
        await removeFromFavesMutation.mutateAsync({friendId,  userId, locationId });
        // setStickToLocation(locationId); // handle this in the components
      } catch (error) {
        console.error("Error removing location from friend faves: ", error);
      }
    },
    [removeFromFavesMutation, userId, friendId]
  );
  return {
    handleRemoveFromFaves,
    removeFromFavesMutation,
  };
};

export default useRemoveFromFaves;
