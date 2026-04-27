import { useQuery } from "@tanstack/react-query";

import { fetchGeckoGameWins } from "@/src/calls/api";

type Props = {
  userId: number;
}

const useGeckoGameWins = ({ userId } : Props) => {

  const {
    data: geckoGameWins,
    isLoading: geckoGameWinsIsLoading,
    isSuccess: geckoGameWinsIsSuccess,
    isError: geckoGameWinsIsError,
    refetch: refetchGeckoGameWins,
  } = useQuery({
    queryKey: ["geckoGameWins", userId ?? 0],
    queryFn: () => fetchGeckoGameWins(),
    enabled: !!userId,
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
