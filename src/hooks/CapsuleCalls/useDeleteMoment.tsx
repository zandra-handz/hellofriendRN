import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMomentAPI } from "@/src/calls/api";

import useUpdateUpcomingItemCache from "../useUpdateUpcomingItemCache";

type Props = {
  userId: number;
  friendId: number;
};

const useDeleteMoment = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const { removeFromUpcomingCapsuleSummary } = useUpdateUpcomingItemCache({
    userId: userId,
  });

  const handleDeleteMoment = async (data) => {

    console.log(data)
    try {
      await deleteMomentMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

const deleteMomentMutation = useMutation({
  mutationFn: (data) => deleteMomentAPI(data),
  onSuccess: (responseData, variables) => {
    // responseData = what the API returned
    // variables = the original data passed to mutateAsync

    queryClient.setQueryData(["Moments", userId, friendId], (old) => {
      return old ? old.filter((moment) => moment.id !== responseData.id) : [];
    });

    console.log("DATA IN DELETE", variables);

    removeFromUpcomingCapsuleSummary({
      friend_id: friendId,
      category_name: variables.user_category_name,
    });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
      }, 500);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
      }, 500);
    },
  });

  return {
    handleDeleteMoment,
    deleteMomentMutation,
  };
};

export default useDeleteMoment;
