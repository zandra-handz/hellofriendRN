import { useQuery } from "@tanstack/react-query";
import { fetchGeckoGameMatchWinPending } from "@/src/calls/api";

type Props = {
  pendingId?: number | null;
};

const useGeckoGameMatchWinPending = ({ pendingId }: Props) => {
  const {
    data: geckoGameMatchWinPending,
    isLoading: geckoGameMatchWinPendingIsLoading,
    isSuccess: geckoGameMatchWinPendingIsSuccess,
    isError: geckoGameMatchWinPendingIsError,
    refetch: refetchGeckoGameMatchWinPending,
  } = useQuery({
    queryKey: ["geckoGameMatchWinPending", pendingId],
    queryFn: () => fetchGeckoGameMatchWinPending(pendingId as number),
    enabled: !!pendingId,
    retry: 3,
  });

  return {
    geckoGameMatchWinPending,
    geckoGameMatchWinPendingIsLoading,
    geckoGameMatchWinPendingIsSuccess,
    geckoGameMatchWinPendingIsError,
    refetchGeckoGameMatchWinPending,
  };
};

export default useGeckoGameMatchWinPending;