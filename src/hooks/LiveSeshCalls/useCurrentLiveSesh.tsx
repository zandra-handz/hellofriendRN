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


  const isHost = useMemo(() => {
    if (data) {
      return data?.is_host
    }
    return undefined

  }, [data]);



  return {
    currentLiveSesh: data,
    isHost,
    isLoading,
    isSuccess,
    refetch,
  };
};

export default useCurrentLiveSesh;
