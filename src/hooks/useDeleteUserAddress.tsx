import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeUserAddress } from "../calls/api";

type Props = {
  userId: number;
};

const useDeleteUserAddress = ({ userId }: Props) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const deleteUserAddressMutation = useMutation({
    mutationFn: (data) => removeUserAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["userAddresses"]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteUserAddressMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.error("Error deleting address:", error);
      timeoutRef.current = setTimeout(() => {
        deleteUserAddressMutation.reset();
      }, 2000);
    },
  });

  const deleteUserAddress = (addressId) => {
    try {
      deleteUserAddressMutation.mutate(addressId);
    } catch (error) {
      console.error("Error deleting address from friend addresses: ", error);
    }
  };

  return {
    deleteUserAddress,
    deleteUserAddressMutation,
  };
};

export default useDeleteUserAddress;
