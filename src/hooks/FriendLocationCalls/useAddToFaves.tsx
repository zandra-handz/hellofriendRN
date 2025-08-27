import { View, Text } from "react-native";
import React, { useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToFriendFavesLocations } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useAddToFaves = ({ userId, friendId  }: Props) => {
  const timeoutRef = useRef(null);
  const queryClient = useQueryClient();

  const addToFavesMutation = useMutation({
    mutationFn: (data) => {
      return addToFriendFavesLocations(data);
    },

    // old?.friend_faves?.locations != data?.locations || !old
    onSuccess: (response, variables) => { 
      // console.log(`backend locations`, data.locations);
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
      console.error("Error adding location to friend faves:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        addToFavesMutation.reset();
      }, 2000);
    },
  });

  const handleAddToFaves = useCallback(
    async ({   locationId }) => {
      if (!userId) {
        console.warn("No user logged in - cannot add to favorites");
        return;
      }

  
      try {
        await addToFavesMutation.mutateAsync({ friendId,  userId, locationId });
        // setStickToLocation(locationId); // handle in component

        // return locationId;
      } catch (error) {
        console.error("Error adding location to friend faves: ", error);
      }
    },
    [addToFavesMutation, userId, friendId]
  );

  return {
    handleAddToFaves,
    addToFavesMutation,
  };
};

export default useAddToFaves;
