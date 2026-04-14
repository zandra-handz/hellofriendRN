import { useQuery } from "@tanstack/react-query";
import { getCurrentLiveSesh } from "@/src/calls/api";
import { useMemo} from "react";

type Props = {
  userId: number;
  enabled?: boolean;
};

const useCurrentLiveSesh = ({ userId, enabled = true }: Props) => {
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["currentLiveSesh", userId],
    queryFn: () => getCurrentLiveSesh(),
    enabled: !!userId && enabled,
    staleTime: 0,
  });


 


  return {
    currentLiveSesh: data,                
    isHost: data?.is_host ?? false,
    sessionFriendId: data?.friend != null ? Number(data.friend) : null,                                                                                                                                                                                                                                                     isLoading,
    isSuccess,                                                                                                                                                                                                                                                                                                          
    refetch,      
  };
};

export default useCurrentLiveSesh;
