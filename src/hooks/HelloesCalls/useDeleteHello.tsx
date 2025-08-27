import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteHelloAPI } from "@/src/calls/api";
type Props = {
  userId: number;
  friendId: number; //to remove from the cache
};
import { formatDate } from "date-fns"; //NOT SURE IF THIS IS THE RIGHT IMPORT

import useRefetchUpcomingHelloes from "../UpcomingHelloesCalls/useRefetchUpcomingHelloes";



// NEED TO IMPLEMENT
const useDeleteHello = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  //may not want inside this hook but will want to make sure it is used when a hello is deleted
  const { refetchUpcomingHelleos } = useRefetchUpcomingHelloes({
    userId: userId,
  });

  const handleDeleteHello = async (data) => {
    try {
      await deleteHelloMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHelloMutation = useMutation({
    mutationFn: (data) => deleteHelloAPI(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["pastHelloes", userId, friendId], (old) => {
        return old ? old.filter((hello) => hello.id !== data.id) : [];
      });

      refetchUpcomingHelleos();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteHelloMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset the state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        deleteHelloMutation.reset();
      }, 2000);
    },
  });

  return { handleDeleteHello, deleteHelloMutation };
};

export default useDeleteHello;
