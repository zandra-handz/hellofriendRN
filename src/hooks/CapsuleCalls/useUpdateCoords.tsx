import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMomentAPI, updateMomentCoordsAPI } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateMomentCoords = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const handleUpdateMomentCoords = (capsuleCoordData) => {
    updateMomentCoordsMutation.mutate({ capsuleCoordData });
  };

  const updateMomentCoordsMutation = useMutation({
    mutationFn: ({ capsuleCoordData }) =>
      updateMomentCoordsAPI(friendId, capsuleCoordData),

onSuccess: ({ updated }) => {
  queryClient.setQueryData(["Moments", userId, friendId], (oldMoments) => {
    if (!oldMoments) return [];

    return oldMoments.map(moment => {
      const newData = updated.find(u => u.id === moment.id);
      if (newData) {
        const updatedMoment = { ...moment, ...newData };
        // console.log(`Updated moment ${moment.id}:`, updatedMoment);
        return updatedMoment;
      }
      return moment;
    });
  });
},

    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateMomentCoordsMutation.reset();
      }, 500);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateMomentCoordsMutation.reset();
      }, 500);
    },
  });

  return {
    handleUpdateMomentCoords,
    updateMomentCoordsMutation,
  };
};

export default useUpdateMomentCoords;
