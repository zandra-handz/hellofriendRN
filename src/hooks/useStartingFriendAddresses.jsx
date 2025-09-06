import React from "react";

import { fetchFriendAddresses } from "@/src/calls/api";

import { useQuery } from "@tanstack/react-query";

const useStartingFriendAddresses = ({ userId, friendId }) => {
  console.warn("STARTING ADDRESSES");

  const {
    data: friendAddresses = [],
    // isLoading,
    // isFetching,
    // isSuccess,
    // isError,
  } = useQuery({
    queryKey: ["friendAddresses", userId, friendId],
    queryFn: () => fetchFriendAddresses(friendId),
    enabled: !!(userId && friendId), //adding isInitializing will cause an infinite regression prop bc of something else in the code here
    staleTime: 1000 * 60 * 20, // 20 minutes
  });

  return {
    friendAddresses,
  };
};

export default useStartingFriendAddresses;
