import { QueryClient } from "@tanstack/react-query";
import { fetchFriendDashboard } from "@/src/calls/api";

export async function prefetchFriendDash(
  userId: number,
  friendId: number,
  queryClient: QueryClient
) {

    console.log('PREFETCH FRIEND TRIGGERED')
  if (!userId || !friendId) return;

  console.log('PREFETCHING FRIEND')

  await queryClient.prefetchQuery({
    queryKey: ["friendDashboardData", userId, friendId],
    queryFn: () => fetchFriendDashboard(friendId),
    staleTime: 1000 * 60 * 20,
  });
}
