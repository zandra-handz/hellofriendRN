// this is my first time using prefetches so I am building as hook first just for my own sake to keep track of
// where I'm doing them

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { fetchUserAddresses, fetchFriendAddresses } from "@/src/calls/api";

const usePrefetches = () => {
  const queryClient = useQueryClient();
  const { selectedFriend } = useSelectedFriend();
  const { user, isInitializing } = useUser();
 
  const prefetchUserAddresses = async () => {
   
    await queryClient.prefetchQuery({
      queryKey: ["userAddresses", user?.id],
      queryFn: () => fetchUserAddresses(),
      enabled: !!(user?.id), // testing removing this && !isInitializing),
      staleTime: 1000 * 60 * 20, // 20 minutes
    });
  };
 
  const prefetchFriendAddresses = async () => {
    console.log("prefetching friend addresses"); 
    await queryClient.prefetchQuery({
      queryKey: ["friendAddresses", user?.id, selectedFriend?.id],
      queryFn: () => fetchFriendAddresses(selectedFriend.id),
      enabled: !!selectedFriend,
      staleTime: 1000 * 60 * 20, // 20 minutes
    });
  };

  return { prefetchUserAddresses, prefetchFriendAddresses };
};

export default usePrefetches;
