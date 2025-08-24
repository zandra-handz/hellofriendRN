import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMomentAPI } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useDeleteMoment = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const handleDeleteMoment = async (data) => {
      try {
        await deleteMomentMutation.mutateAsync(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    const deleteMomentMutation = useMutation({
      mutationFn: (data) => deleteMomentAPI(data),
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["Moments", userId, friendId],
          (old) => {
            return old ? old.filter((moment) => moment.id !== data.id) : [];
          }
        );
  
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
