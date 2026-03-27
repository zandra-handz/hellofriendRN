import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMomentAPI, updateMomentCoordsAPI } from "@/src/calls/api";
import { networkRef } from "@/src/handlers/utils_networkStatus";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateMomentCoords = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);
  const queryClient = useQueryClient();

  const updateMomentCoordsMutation = useMutation({
    mutationFn: ({ capsuleCoordData }) =>
      updateMomentCoordsAPI(friendId, capsuleCoordData),

    onSuccess: ({ updated }) => {
      queryClient.setQueryData(["Moments", userId, friendId], (oldMoments) => {
        if (!oldMoments) return [];

        return oldMoments.map((moment) => {
          const newData = updated.find((u) => u.id === moment.id);
          if (newData) {
            return { ...moment, ...newData };
          }
          return moment;
        });
      });
    },

    onError: (error) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateMomentCoordsMutation.reset();
      }, 500);
    },

    onSettled: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateMomentCoordsMutation.reset();
      }, 500);
    },
  });

  const handleUpdateMomentCoords = async (capsuleCoordData) => {
    if (networkRef && networkRef.isOnline === true) {
      try {
        await updateMomentCoordsMutation.mutateAsync({ capsuleCoordData });
      } catch (e) {
        // onError handles it
      }
    } else {
      showFlashMessage("Offline mode can't save moments positions", false, 1000);
    }
  };

  return {
    handleUpdateMomentCoords,
    updateMomentCoordsMutation,
  };
};

export default useUpdateMomentCoords;