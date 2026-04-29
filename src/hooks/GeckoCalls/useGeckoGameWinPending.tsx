  import { useQuery } from "@tanstack/react-query";                                                                                                                                                                                            
  import { fetchGeckoGameWinPending } from "@/src/calls/api";                                                                                                                                                                                

  type Props = {
    userId?: number | null;
    disable?: boolean;
  };

  const useGeckoGameWinPending = ({ userId, disable = false }: Props) => {
    const {
      data: geckoGameWinPending,
      isLoading: geckoGameWinPendingIsLoading,
      isSuccess: geckoGameWinPendingIsSuccess,
      isError: geckoGameWinPendingIsError,
      refetch: refetchGeckoGameWinPending,
    } = useQuery({
      queryKey: ["geckoGameWinPending", userId ?? 0],
      queryFn: () => fetchGeckoGameWinPending(),
      enabled: !!userId && !disable,
      retry: 1,
    });

    return {
      geckoGameWinPending,                  // null when no active pending, object otherwise
      geckoGameWinPendingIsLoading,
      geckoGameWinPendingIsSuccess,
      geckoGameWinPendingIsError,
      refetchGeckoGameWinPending,
    };
  };

  export default useGeckoGameWinPending;