import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFriendAddress } from "../calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useCreateFriendAddress = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

  const createFriendAddressMutation = useMutation({
    mutationFn: (data) => addFriendAddress(friendId, data),
    onSuccess: (newAddress) => {
      queryClient.setQueryData(
        ["friendAddresses", userId, friendId],
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return [newAddress];

          const combinedData = [...oldData, newAddress];

          return combinedData.map((address) => {
            if (address.is_default && address.id !== newAddress.id) {
              console.log("Turning off default for", address.title);
              return { ...address, is_default: false };
            }
            if (address.id === newAddress.id) {
              console.log("Turning on default for address", address.title);
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
        createFriendAddressMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.error("Error adding address:", error);
      timeoutRef.current = setTimeout(() => {
        createFriendAddressMutation.reset();
      }, 2000);
    },
  });

  const createFriendAddress = (title, address) => {
    try {
      const addressData = {
        title,
        address,
        is_default: true,
        friend: friendId,
        user: userId,
      };

      createFriendAddressMutation.mutate(addressData);
    } catch (error) {
      console.error("Error adding address to friend addresses: ", error);
    }
  };

  return {
    createFriendAddress,
    createFriendAddressMutation,
  };
};

export default useCreateFriendAddress;
