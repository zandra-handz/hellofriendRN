 
import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
  isInitializing?: boolean;
  friendIsReady: boolean;
  enabled: boolean;

  friendId: number;
};

const useSelectedFriendStats = ({
  userId,
  isInitializing=false,
  friendId,
  friendIsReady,
  enabled,
}: Props) => {
  const queryClient = useQueryClient();

  const { data: selectedFriendStats, isLoading: loadingFriendStats } = useQuery(
    {
      queryKey: ["selectedFriendStats", userId, friendId],
      queryFn: () =>
        fetchCategoriesHistoryCountAPI({
          friendId: friendId,
          returnNonZeroesOnly: true,
        }),
      // queryFn: () => fetchCategoriesFriendHistoryAPI(selectedFriend.id, false), //return non-empty categories only
      enabled: !!(
        userId &&
        friendId &&
        friendIsReady &&
        !isInitializing &&
        enabled
      ),
      staleTime: 1000 * 60 * 60 * 10, // 10 hours
    }
  );

  const refetchFriendStats = () => {
    if (userId && !isInitializing && friendId) {
      queryClient.refetchQueries(["selectedFriendStats", userId, friendId]);
    }
  };

  const invalidateFriendStats = () => {
    if (userId && !isInitializing && friendId) {
      queryClient.invalidateQueries(["selectedFriendStats", userId, friendId]);
    }
  };

  return {
    selectedFriendStats,
    loadingFriendStats,
    refetchFriendStats,
    invalidateFriendStats,
  };
};

export default useSelectedFriendStats;
