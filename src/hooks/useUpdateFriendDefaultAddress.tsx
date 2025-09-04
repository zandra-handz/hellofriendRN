import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFriendAddress } from "../calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateFriendDefaultAddress = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();



  const updateFriendDefaultAddressMutation = useMutation({
    mutationFn: ({ friend, id, fieldUpdates }) =>
      updateFriendAddress(friend, id, fieldUpdates),

    onSuccess: (updatedAddress) => {
      queryClient.setQueryData(
        ["friendAddresses", userId, friendId],
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return [];

          return oldData.map((address) => {
            if (address.is_default && address.id !== updatedAddress.id) {
              console.log("turning off default for", address.title);

              return { ...address, is_default: false };
            }
            if (address.id === updatedAddress.id) {
              console.log("turning on default for address ", address.title);

              return { ...address, is_default: true };
            }

            return address;
          });
        }
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendDefaultAddressMutation.reset();
      }, 2000);
    },

    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.error("Error updating address:", error);

      timeoutRef.current = setTimeout(() => {
        updateFriendDefaultAddressMutation.reset();
      }, 2000);
    },
  });



    

  const updateFriendDefaultAddress = async (addressId) => {
    const newData = {
      is_default: true, //backend will turn the previous one to false
    };

    try {
      await updateFriendDefaultAddressMutation.mutateAsync({
        friend: friendId,
        user: userId,
        id: addressId,
        fieldUpdates: newData,
      });
    } catch (error) {
      console.error("Error adding address to friend addresses: ", error);
    }
  };


  return {
    updateFriendDefaultAddress,
    updateFriendDefaultAddressMutation,
  }
};

export default useUpdateFriendDefaultAddress;
