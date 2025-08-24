import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMomentAPI } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useEditMoment = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const handleEditMoment = (capsuleId, capsuleEditData) => {
    editMomentMutation.mutate({ capsuleId, capsuleEditData });
  };

  const editMomentMutation = useMutation({
    mutationFn: ({ capsuleId, capsuleEditData }) =>
      updateMomentAPI(friendId, capsuleId, capsuleEditData),

    onSuccess: (data) => {
      queryClient.setQueryData(["Moments", userId, friendId], (oldMoments) => {
        if (!oldMoments) return [];

        return oldMoments.map((moment) =>
          moment.id === data.id ? { ...moment, ...data } : moment
        );
      });

      //THIS WILL CAUSE FRIEND DASHBOARD DATA TO RERENDER, FUCK IF I KNOW WHY. THE ABOVE CODE IS SUFFICIENT ANYWAY ! :)
      //queryClient.invalidateQueries(["Moments", user?.id, selectedFriend?.id]);

      //(THIS IS ALSO NOT NEEDED)
      // queryClient.setQueryData(
      //   ["Moments", user?.id, selectedFriend?.id],
      //   (oldMoments) => {
      //     //REMOVING TO CHANGE CAPSULE LIST LENGTH IN MOMENTS SCREEN OTHERWISE WON'T UPDATE
      //     const updatedMoments = oldMoments
      //       ? oldMoments.filter((moment) => moment.id !== data.id)
      //       : [];

      //     return updatedMoments;
      //   }
      // );
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        editMomentMutation.reset();
      }, 500);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        editMomentMutation.reset();
      }, 500);
    },
  });

  return {
    handleEditMoment,
    editMomentMutation,
  };
};

export default useEditMoment;
