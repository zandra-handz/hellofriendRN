import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";
import { getGeckoScriptsData } from "@/src/calls/api";

const geckoScriptsDataQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoScriptsData", userId],
  queryFn: () => getGeckoScriptsData(),
  enabled: !!userId,
  retry: 3,
});

const useGeckoScriptsData = () => {
  const { user, isInitializing } = useUser();

  const {
    data: geckoScriptsData,
    isLoading: loadingGeckoScriptsData,
    isSuccess: geckoScriptsDataLoaded,
  } = useQuery({
    ...geckoScriptsDataQueryOptions(user?.id ?? 0),
    enabled: !!user?.id && !isInitializing,
  });

  return {
    geckoScriptsData,
    loadingGeckoScriptsData,
    geckoScriptsDataLoaded,
  };
};

export default useGeckoScriptsData;