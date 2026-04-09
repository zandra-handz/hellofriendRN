import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";
import { useMemo } from 'react';
import { getGeckoScoreState } from "@/src/calls/api";

const geckoScoreStateQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoScoreState", userId],
  queryFn: () => getGeckoScoreState(),
  enabled: !!userId,
  retry: 3,
});

  const useGeckoScoreState = () => {                                                                                                                                                                                                                             const { user, isInitializing } = useUser();                                                                                                                                                                                                              
                                                                                                                                                                                                                                                             
    const {       
      data: geckoScoreState,
      isLoading: loadingGeckoScoreState,
      isSuccess: geckoScoreStateLoaded,
    } = useQuery({
      ...geckoScoreStateQueryOptions(user?.id ?? 0),
      enabled: !!user?.id && !isInitializing,
      refetchInterval: (query) => {
        const data = query.state.data;
        if (data?.revives_at) {
          const msUntilRevival = new Date(data.revives_at).getTime() - Date.now();
          if (msUntilRevival <= 0) return 1000; // already past, refetch soon
          return msUntilRevival + 1000; // refetch 1s after revival time
        }
        return false; // no auto-refetch otherwise
      },
    });



    const geckoEnergyLevel = useMemo(() => { 
      
      return geckoScoreState?.energy ?? null;
    }, [geckoScoreState?.energy])

    return {
      geckoEnergyLevel,
      geckoScoreState,
      loadingGeckoScoreState,
      geckoScoreStateLoaded,
    };
  };
export default useGeckoScoreState;
