import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPastHelloes } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
  isInitializing?: boolean;

  enabled: boolean;
};

const useHelloes = ({
  userId,
  friendId,
  isInitializing = false,

  enabled = true,
}: Props) => { 

  const {
    data: helloesList,
    isLoading: helloesIsLoading,
    isFetching: helloesIsFetching,
    isSuccess: helloesIsSuccess,
    isError: helloesIsError,
  } = useQuery({
    queryKey: ["pastHelloes", userId, friendId],
    queryFn: () => {
      return fetchPastHelloes(friendId);
    },
    enabled: !!(userId && !isInitializing && friendId && enabled), // testing removing !isInitializing
    staleTime: 1000 * 60 * 20, // 20 minutes, same as selected friend data
  });

  return {
    helloesList,

    helloesIsFetching,
    helloesIsLoading,
    helloesIsError,
    helloesIsSuccess,
  };
};

export default useHelloes;
