import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";
import { getGeckoScoreState } from "@/src/calls/api";

const geckoScoreStateQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoScoreState", userId],
  queryFn: () => getGeckoScoreState(),
  enabled: !!userId,
  retry: 3,
});

const useGeckoScoreState = () => {
  const { user, isInitializing } = useUser();

  const {
    data: geckoScoreState,
    isLoading: loadingGeckoScoreState,
    isSuccess: geckoScoreStateLoaded,
  } = useQuery({
    ...geckoScoreStateQueryOptions(user?.id ?? 0),
    enabled: !!user?.id && !isInitializing,
  });

  return {
    geckoScoreState,
    loadingGeckoScoreState,
    geckoScoreStateLoaded,
  };
};

export default useGeckoScoreState;
