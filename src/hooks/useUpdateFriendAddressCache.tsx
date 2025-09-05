import { View, Text } from "react-native";
import React, { useRef } from "react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
 

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateFriendAddressCache = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);

  const queryClient = useQueryClient();

const getChosenAddress = () => {
  const data = queryClient.getQueryData(["friendAddresses", userId, friendId]);
  return data?.chosen || null;
};
 
const updateChosenAddress = (address) => {
  queryClient.setQueryData(
    ["friendAddresses", userId, friendId],
    (old) => ({
      ...old,
      chosen: address,
    })
  );
};

 
const addAddressToTemporaryCache = (address) => {
  queryClient.setQueryData(
    ["friendAddresses", userId, friendId],
    (old) => ({
      ...old,
      temp: old?.temp ? [...old.temp, address] : [address],
    })
  );
};

// remove an address from temp by id
const removeAddressFromTemporaryCache = (address) => {
  queryClient.setQueryData(
    ["friendAddresses", userId, friendId],
    (old) => ({
      ...old,
      temp: old?.temp ? old.temp.filter((a) => a.id !== address.id) : [],
    })
  );
};


  return {
    updateChosenAddress,
    getChosenAddress,
    removeAddressFromTemporaryCache,
    addAddressToTemporaryCache,
};
}

export default useUpdateFriendAddressCache;
