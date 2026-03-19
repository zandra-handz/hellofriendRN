import { QueryClient } from "@tanstack/react-query";
import { fetchPastHelloes } from "../calls/api";

export function prefetchHelloes(
  userId: number,
  friendId: number,
  queryClient: QueryClient,
) {
  if (!userId || !friendId) return;

  console.log(`PREFETCH: Helloes for ${friendId}`);

  queryClient.prefetchQuery({
    queryKey: ["pastHelloes", userId, friendId],
    queryFn: () => {
      return fetchPastHelloes(friendId);
    },
  });
}
