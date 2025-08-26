import { View, Text } from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
};

const useRefetchUpcomingHelloes = ({ userId }: Props) => {
  const queryClient = useQueryClient();

  const refetchUpcomingHelloes = () => {
    queryClient.refetchQueries({ queryKey: ["upcomingHelloes", userId] });
  };

  return { refetchUpcomingHelloes };
};

export default useRefetchUpcomingHelloes;
