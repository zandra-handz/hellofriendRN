 

import { QueryClient } from "@tanstack/react-query";
import { fetchFriendDashboard, fetchMomentsAPI } from "@/src/calls/api";

export function prefetchFriendDash(
  userId: number,
  friendId: number,
  queryClient: QueryClient
) {
  if (!userId || !friendId) return;

  console.log(`PRFETCH: Friend ${friendId}`);

  // Prefetch dashboard
  queryClient.prefetchQuery({
    queryKey: ["friendDashboardData", userId, friendId],
    queryFn: () => fetchFriendDashboard(friendId),
   // staleTime: 1000 * 60 * 20,
  });

  // Prefetch moments/capsules
  queryClient.prefetchQuery({
    queryKey: ["Moments", userId, friendId],
    queryFn: () => fetchMomentsAPI(friendId),
    //staleTime: 1000 * 60 * 120, // 2 hours, same as in context
  });
}


