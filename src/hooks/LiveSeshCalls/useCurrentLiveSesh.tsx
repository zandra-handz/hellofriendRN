import { useQuery } from "@tanstack/react-query";
import { getCurrentLiveSesh } from "@/src/calls/api";
// import { useMemo} from "react";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
type Props = {
  userId: number;
  enabled?: boolean;
};

const useCurrentLiveSesh = ({ userId, enabled = true }: Props) => {
  // const { selectedFriend} = useSelectedFriend();
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["currentLiveSesh", userId],
    queryFn: () => getCurrentLiveSesh(),
    enabled: !!userId && enabled,
    staleTime: 0,
  });
 

  return {
    currentLiveSesh: data,  
    playMode: data?.gecko_play_mode ?? null,       
    playModeLabel: data?.gecko_play_mode_label ?? null,       
    isHost: data?.is_host ?? false,
    sessionFriendId: data?.friend != null ? Number(data.friend) : null,                                                                                                                                                                                                                                                     isLoading,
    isSuccess,                                                                                                                                                                                                                                                                                                          
    refetch,      
  };
};

export default useCurrentLiveSesh;
