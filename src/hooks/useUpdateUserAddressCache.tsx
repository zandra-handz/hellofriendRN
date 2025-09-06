import { View, Text } from "react-native";
import React, { useRef } from "react";
import {   useQueryClient } from "@tanstack/react-query";
 

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateUserAddressCache = ({ userId  }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

const getChosenUserAddress = () => {
  const data = queryClient.getQueryData(["userAddresses", userId]);
  return data?.chosen || null;
};
 
const updateChosenUserAddress = (address) => {
  queryClient.setQueryData(
    ["userAddresses", userId],
    (old) => ({
      ...old,
      chosen: address,
    })
  );
};

 
const addUserAddressToTemporaryCache = (address) => {
  queryClient.setQueryData(
    ["userAddresses", userId],
    (old) => ({
      ...old,
      temp: old?.temp ? [...old.temp, address] : [address],
    })
  );
};

// remove an address from temp by id
const removeUserAddressFromTemporaryCache = (address) => {
  queryClient.setQueryData(
    ["userAddresses", userId],
    (old) => ({
      ...old,
      temp: old?.temp ? old.temp.filter((a) => a.id !== address.id) : [],
    })
  );
};


  return {
    updateChosenUserAddress,
    getChosenUserAddress,
    removeUserAddressFromTemporaryCache,
    addUserAddressToTemporaryCache,
};
}

export default useUpdateUserAddressCache;
