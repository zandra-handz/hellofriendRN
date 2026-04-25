import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMomentAPI } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const usePreAddMoment = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const updateCacheWithNewPreAdded = (momentData, isPreAdded) => {
    queryClient.setQueryData(["Moments", userId, friendId], (oldMoments) => {
      if (!oldMoments) return [{ ...momentData, pre_added_to_hello: isPreAdded }];

      const updatedMoments = [...oldMoments];
      const momentIndex = updatedMoments.findIndex(
        (moment) => moment.id === momentData.id
      );

      if (momentIndex !== -1) {
        updatedMoments[momentIndex] = {
          ...updatedMoments[momentIndex],
          ...momentData,
          pre_added_to_hello: isPreAdded,
        };
      } else {
        updatedMoments.unshift({
          ...momentData,
          pre_added_to_hello: isPreAdded,
        });
      }

      // preAddMomentMutation.reset();

      return updatedMoments;
    });
  };

  const handlePreAddMoment = ({
    friendId,
    capsuleId,
    isPreAdded,
  }: {
    friendId: number;
    capsuleId: number;
    isPreAdded: boolean;
  }) => preAddMomentMutation.mutate({ friendId, capsuleId, isPreAdded });

  type PreAddMomentInput = {
    friendId: number;
    capsuleId: number;
    isPreAdded: boolean;
  };

  const preAddMomentMutation = useMutation({
    mutationFn: ({ friendId, capsuleId, isPreAdded }: PreAddMomentInput) =>
      updateMomentAPI(friendId, capsuleId, {
        pre_added_to_hello: isPreAdded,
      }),

    onSuccess: (data) => {
      queryClient.getQueryData(["Moments", userId, friendId]);
      updateCacheWithNewPreAdded(data, data?.pre_added_to_hello);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        preAddMomentMutation.reset();
      }, 2000);
    },

    onError: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        preAddMomentMutation.reset();
      }, 2000);
    },
  });

  return {
    handlePreAddMoment,
    preAddMomentMutation,
    updateCacheWithNewPreAdded,
  };
};

export default usePreAddMoment;
