import { useQuery } from "@tanstack/react-query";
import useUser from "../useUser";
import { fetchGeckoGameWinsGiven } from "@/src/calls/api";

const useGeckoGameWinsGiven = () => {
  const { user, isInitializing } = useUser();

  const {
    data: geckoGameWinsGiven,
    isLoading: geckoGameWinsGivenIsLoading,
    isSuccess: geckoGameWinsGivenIsSuccess,
    isError: geckoGameWinsGivenIsError,
    refetch: refetchGeckoGameWinsGiven,
  } = useQuery({
    queryKey: ["geckoGameWinsGiven", user?.id ?? 0],
    queryFn: () => fetchGeckoGameWinsGiven(),
    enabled: !!user?.id && !isInitializing,
    retry: 3,
  });

  return {
    geckoGameWinsGiven,
    geckoGameWinsGivenIsLoading,
    geckoGameWinsGivenIsSuccess,
    geckoGameWinsGivenIsError,
    refetchGeckoGameWinsGiven,
  };
};

export default useGeckoGameWinsGiven;
