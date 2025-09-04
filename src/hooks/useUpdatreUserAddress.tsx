import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserAddress } from "../calls/api";

type Props = {
  userId: number;
};

const useUpdateUserDefaultAddress = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const updateUserDefaultAddressMutation = useMutation({
    mutationFn: ({ id, fieldUpdates }) => updateUserAddress(id, fieldUpdates),
    onSuccess: () => {
 
      queryClient.invalidateQueries(["userAddresses"]);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateUserDefaultAddressMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      } 
      console.error("Error updating address:", error);

      timeoutRef.current = setTimeout(() => {
        updateUserDefaultAddressMutation.reset();
      }, 2000);
    },
  });

  const updateUserDefaultAddress = async (addressId) => {
        const newData = {
      is_default: true, //backend will turn the previous one to false
    }; 
    try {
      await updateUserDefaultAddressMutation.mutateAsync({
        user: userId,
        id: addressId,
        fieldUpdates: newData,
      });
    } catch (error) {
      console.error("Error adding address to user addresses: ", error);
    }
  };

  return {
    updateUserDefaultAddress,
    updateUserDefaultAddressMutation,
  };
};

export default useUpdateUserDefaultAddress;
