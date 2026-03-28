

import { useQuery } from "@tanstack/react-query";

import { getUserGeckoConfigs } from "@/src/calls/api";

const userGeckoConfigsQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoConfigs", userId],
  queryFn: () => getUserGeckoConfigs(),
  enabled: !!userId,
  retry: 3,
 // staleTime: 1000 * 60 * 60 * 10,
});

const useUserGeckoConfigs = ({ userId }: { userId: number }) => {
//   const { user, isInitializing } = useUser();

  const {
    data: geckoConfigs,
    isLoading: loadingGeckoConfigs,
    isSuccess: geckoConfigsLoaded,
  } = useQuery({
    ...userGeckoConfigsQueryOptions(userId ?? 0),
    enabled: !!userId,
  });

  return {
    geckoConfigs,
    loadingGeckoConfigs,
    geckoConfigsLoaded,
  };
};

export default useUserGeckoConfigs;