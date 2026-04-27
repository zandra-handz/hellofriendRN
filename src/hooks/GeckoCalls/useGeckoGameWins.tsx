import { useQuery } from "@tanstack/react-query";
import useUser from "../useUser";
import { fetchGeckoGameWins } from "@/src/calls/api";

const useGeckoGameWins = () => {
  const { user, isInitializing } = useUser();

  const {
    data: geckoGameWins,
    isLoading: geckoGameWinsIsLoading,
    isSuccess: geckoGameWinsIsSuccess,
    isError: geckoGameWinsIsError,
    refetch: refetchGeckoGameWins,
  } = useQuery({
    queryKey: ["geckoGameWins", user?.id ?? 0],
    queryFn: () => fetchGeckoGameWins(),
    enabled: !!user?.id && !isInitializing,
    retry: 3,
  });

  return {
    geckoGameWins,
    geckoGameWinsIsLoading,
    geckoGameWinsIsSuccess,
    geckoGameWinsIsError,
    refetchGeckoGameWins,
  };
};

export default useGeckoGameWins;
