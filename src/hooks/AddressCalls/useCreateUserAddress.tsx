 
import React, { useRef } from 'react'
import {   useMutation, useQueryClient } from "@tanstack/react-query";

import { addUserAddress } from '../../calls/api';

type Props = {
    userId: number;
}

const useCreateUserAddress = ({userId}: Props) => {


    const queryClient = useQueryClient();
  const timeoutRef = useRef(null);




  const createUserAddressMutation = useMutation({
    mutationFn: (data) => addUserAddress(data),
    onSuccess: () => {
 

      queryClient.invalidateQueries(["userAddresses"]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createUserAddressMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
 
      console.error("Error adding address:", error);
      timeoutRef.current = setTimeout(() => {
        createUserAddressMutation.reset();
      }, 2000);
    },
  });

    const createUserAddress = (title, address) => {
    try {
      const addressData = {
        title,
        address,
        user: userId,
      };

      createUserAddressMutation.mutate(addressData);
    } catch (error) {
      console.error("Error adding address to friend addresses: ", error);
    }
  };



  return {
    createUserAddress,
    createUserAddressMutation,
  }
}

export default useCreateUserAddress