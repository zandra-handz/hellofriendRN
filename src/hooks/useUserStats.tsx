 
import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
  isInitializing?: boolean;
 
  enabled: boolean; 
};

const useUserStats = ({
  userId,
  isInitializing=false,
 
  enabled, // was using settingsLoaded from UserSettings in the previous Context version of this hook
}: Props) => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: loadingUserStats } = useQuery(
    {
    queryKey: ["userStats", userId],
    queryFn: () => fetchCategoriesHistoryCountAPI({returnNonZeroesOnly: true}), //return non-empty categories only
    
      // queryFn: () => fetchCategoriesFriendHistoryAPI(selectedFriend.id, false), //return non-empty categories only
      enabled: !!(
        userId &&
 
        !isInitializing &&
        enabled
      ),
      staleTime: 1000 * 60 * 60 * 10, // 10 hours
    }
  );

 const refetchUserStats = () => {
     if (userId && !isInitializing) {
    queryClient.refetchQueries(["userStats", userId]);  //also manually added this to categories context
  }

};


const invalidateUserStats = () => {
     if (userId && !isInitializing) {
    queryClient.invalidateQueries(["userStats", userId]);
  }

};


  return {
    stats,
    loadingUserStats,
    refetchUserStats,
    invalidateUserStats
  };
};

export default useUserStats;
