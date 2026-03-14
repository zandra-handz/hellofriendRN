import { View, Text } from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
};



const useRefetchUpcomingHelloes = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const refetchUpcomingHelloes = () => {
 // using line in createHello too and in delete friend
    queryClient.refetchQueries({ queryKey: ["friendListAndUpcoming", userId] }); // might not want this to refetch friends too. on other hand might be simpler
 
 
  };


 

  return { refetchUpcomingHelloes };
};

export default useRefetchUpcomingHelloes;
