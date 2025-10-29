
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFriendDashboard } from "@/src/calls/api";
import { FriendDashboardData } from "../types/FriendTypes";

type Props = {
  userId: number;
  isInitializing?: boolean;
  // friendIsReady: boolean;
  enabled: boolean;

  friendId: number;
};

const useFriendDash = ({
  userId,
  isInitializing = false,
  friendId,
  // friendIsReady,
  enabled,
}: Props) => {
  // const queryClient = useQueryClient();

  const {
    data: friendDash,
    isLoading,
    isSuccess,
  } = useQuery<FriendDashboardData>({
    queryKey: ["friendDashboardData", userId, friendId],
    queryFn: () => fetchFriendDashboard(friendId),

    enabled: !!(userId && friendId && !isInitializing), //testing removing !isInitializing
    staleTime: 1000 * 60 * 20,
  });

  return {
    loadingDash: isLoading,
    dashLoaded: isSuccess,
    friendDash,
  };
};

export default useFriendDash;
