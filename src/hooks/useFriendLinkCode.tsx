 

 
import { useQuery } from "@tanstack/react-query"; 
import { getFriendLinkCode } from "@/src/calls/api";
import { secondsUntil } from "../utils/dateUtils";
import { useMemo } from 'react';
 

export interface FriendLinkType {
  id: number; 
}

type Props = {
  userId: number; 
  enabled?: boolean;
};


const friendLinkQueryOptions = (userId: number, enabled: boolean) => ({
    queryKey: ["friendLinkCode", userId],
    queryFn: () => getFriendLinkCode(),
    enabled: !!userId && !!enabled,
  });

const useFriendLinkCode = ({
  userId, 
  enabled = true,
}: Props) => {
  const { data, isLoading, isSuccess, refetch } = useQuery({
    ...friendLinkQueryOptions(userId ?? 0, enabled),
    enabled: !!(userId  && enabled),
    staleTime: 0,
  });



  const code = useMemo(() => {
    if (data?.code) {
        return data.code;
    }

  }, [data?.code]);

    const secondsTillExpires = useMemo(() => {
    if (data?.expires_at) {
        return secondsUntil(data.expires_at);// - Date.now();
    }

  }, [data?.expires_at]);

//   const userCategories = useMemo(() => {
//     if (!data) return [];
//     return data;
//   }, [data]);

 
  return {
    code,
    secondsTillExpires,
    refetch,
    data,
    isLoading,
    isSuccess,
  };
};

export default useFriendLinkCode;




