import { useMemo, useRef } from "react";
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
    refetchInterval: (query) => {
      const hours = query.state.data?.active_hours;
      if (!hours || hours.length === 0) return false;

      const now = new Date();
      const currentHour = now.getHours();
      const isActive = hours.includes(currentHour);

      for (let i = 1; i <= 24; i++) {
        const checkHour = (currentHour + i) % 24;
        const willBeActive = hours.includes(checkHour);
        if (willBeActive !== isActive) {
          const target = new Date(now);
          target.setHours(currentHour + i, 0, 0, 0);
          return target.getTime() - now.getTime() + 1000;
        }
      }

      return false;
    },
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