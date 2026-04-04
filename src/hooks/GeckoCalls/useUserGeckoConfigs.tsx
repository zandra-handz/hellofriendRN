import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserGeckoConfigs } from "@/src/calls/api";

const userGeckoConfigsQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoConfigs", userId],
  queryFn: () => getUserGeckoConfigs(),
  enabled: !!userId,
  retry: 3,
});

const useUserGeckoConfigs = ({ userId }: { userId: number }) => {
  const {
    data: geckoConfigs,
    isLoading: loadingGeckoConfigs,
    isSuccess: geckoConfigsLoaded,
  } = useQuery({
    ...userGeckoConfigsQueryOptions(userId ?? 0),
    enabled: !!userId,
  });

  const isAwake = useMemo(() => {
    if (!geckoConfigs?.active_hours) return false;

    const currentHour = new Date().getHours();

    return geckoConfigs.active_hours.includes(currentHour);
  }, [geckoConfigs?.active_hours]);

  return {
    geckoConfigs,
    loadingGeckoConfigs,
    geckoConfigsLoaded,
    isAwake,
  };
};

export default useUserGeckoConfigs;