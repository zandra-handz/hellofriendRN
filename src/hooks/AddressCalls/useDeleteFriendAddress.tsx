import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { removeFriendAddress } from "../../calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useDeleteFriendAddress = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();



  const deleteFriendAddressMutation = useMutation({
    mutationFn: (data) => removeFriendAddress(friendId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["friendAddresses", userId, friendId],
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return []; // If no existing data, return an empty array
          return oldData.filter((address) => address.id !== data.id); // Filter out the deleted address
        }
      );
      //queryClient.invalidateQueries(['friendAddresses', selectedFriend?.id]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteFriendAddressMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.error("Error deleting address:", error);
      timeoutRef.current = setTimeout(() => {
        deleteFriendAddressMutation.reset();
      }, 2000);
    },
  });




    

      //selectedFriend.id is directly in mutation. still not sure which is better approach
  //this file is an unholy mix of both approaches right now sorry
  const deleteFriendAddress = (addressId) => {
    try {
      deleteFriendAddressMutation.mutate(addressId);
    } catch (error) {
      console.error("Error deleting address from friend addresses: ", error);
    }
  };



  return {
    deleteFriendAddress,
    deleteFriendAddressMutation,
  }
};

export default useDeleteFriendAddress;
