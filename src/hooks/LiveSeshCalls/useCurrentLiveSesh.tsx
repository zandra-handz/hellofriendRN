import { useQuery } from "@tanstack/react-query";
import { getCurrentLiveSesh } from "@/src/calls/api";
import { useMemo} from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
type Props = {
  userId: number;
  enabled?: boolean;
};

const useCurrentLiveSesh = ({ userId, enabled = true }: Props) => {
  const { selectedFriend} = useSelectedFriend();
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["currentLiveSesh", userId],
    queryFn: () => getCurrentLiveSesh(),
    enabled: !!userId && enabled,
    staleTime: 0,
  });


  const isHost = useMemo(()=> {
    if (data?.is_host && (Number(data?.friend) === Number(selectedFriend?.id)) ) {
      return true
    } else {
      return false
    }

  }, [data?.is_host, data?.friend,  selectedFriend?.id]);
 


  return {
    currentLiveSesh: data,                
    isHost: data?.is_host ?? false,
    sessionFriendId: data?.friend != null ? Number(data.friend) : null,                                                                                                                                                                                                                                                     isLoading,
    isSuccess,                                                                                                                                                                                                                                                                                                          
    refetch,      
  };
};

export default useCurrentLiveSesh;
