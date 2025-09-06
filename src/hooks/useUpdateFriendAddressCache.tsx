import { View, Text } from "react-native";
import React from "react";
import {  useQueryClient } from "@tanstack/react-query";
 

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateFriendAddressCache = ({ userId, friendId }: Props) => {
 

  const queryClient = useQueryClient();

const getChosenFriendAddress = () => {
  const data = queryClient.getQueryData(["friendAddresses", userId, friendId]);
  return data?.chosen || null;
};
 
const updateChosenFriendAddress = (address) => {
  queryClient.setQueryData(
    ["friendAddresses", userId, friendId],
    (old) => ({
      ...old,
      chosen: address,
    })
  );
};

 
const addFriendAddressToTemporaryCache = (address) => {
  queryClient.setQueryData(
    ["friendAddresses", userId, friendId],
    (old) => ({
      ...old,
      temp: old?.temp ? [...old.temp, address] : [address],
    })
  );
};

// remove an address from temp by id
const removeFriendAddressFromTemporaryCache = (address) => {
  queryClient.setQueryData(
    ["friendAddresses", userId, friendId],
    (old) => ({
      ...old,
      temp: old?.temp ? old.temp.filter((a) => a.id !== address.id) : [],
    })
  );
};


  return {
    updateChosenFriendAddress,
    getChosenFriendAddress,
    removeFriendAddressFromTemporaryCache,
    addFriendAddressToTemporaryCache,
};
}

export default useUpdateFriendAddressCache;
