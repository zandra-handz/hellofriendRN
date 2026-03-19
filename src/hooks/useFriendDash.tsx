

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFriendDashboard } from "@/src/calls/api";
import { FriendDashboardData } from "../types/FriendTypes";

type Props = {
  userId: number;
  isInitializing?: boolean;
  enabled: boolean;
  friendId: number;
};

const friendDashQueryOptions = (userId: number, friendId: number) => ({
  queryKey: ["friendDashboardData", userId, friendId],
  queryFn: () => fetchFriendDashboard(friendId),
  enabled: !!(userId && friendId),
 // staleTime: 1000 * 60 * 20,
});

const useFriendDash = ({
  userId,
  isInitializing = false,
  friendId,
  enabled,
}: Props) => {
  const {
    data: friendDash,
    isLoading,
    isSuccess,
  } = useQuery<FriendDashboardData>({
    ...friendDashQueryOptions(userId, friendId),
    enabled: !!(userId && friendId && !isInitializing),
  });

  return {
    loadingDash: isLoading,
    dashLoaded: isSuccess,
    friendDash,
  };
};

export default useFriendDash;