// import { useQuery } from "@tanstack/react-query";
// import useUser from "./useUser";
// import { useMemo } from 'react';
// import { getGeckoScoreState } from "@/src/calls/api";

// const geckoScoreStateQueryOptions = (userId: number) => ({
//   queryKey: ["userGeckoScoreState", userId],
//   queryFn: () => getGeckoScoreState(),
//   enabled: !!userId,
//   retry: 3,
// });

//   const useGeckoScoreState = () => {                                                                                                                                                                                                                             const { user, isInitializing } = useUser();                                                                                                                                                                                                              
                                                                                                                                                                                                                                                             
//     const {       
//       data: geckoScoreState,
//       isLoading: loadingGeckoScoreState,
//       isSuccess: geckoScoreStateLoaded,
//     } = useQuery({
//       ...geckoScoreStateQueryOptions(user?.id ?? 0),
//       //enabled: !!user?.id && !isInitializing,
//       refetchInterval: (query) => {
//         const data = query.state.data;
//         if (data?.revives_at) {
//           const msUntilRevival = new Date(data.revives_at).getTime() - Date.now();
//           if (msUntilRevival <= 0) return 1000; // already past, refetch soon
//           return msUntilRevival + 1000; // refetch 1s after revival time
//         }
//         return false; // no auto-refetch otherwise
//       },
//     });



//     const geckoEnergyLevel = useMemo(() => { 
      
//       return geckoScoreState?.energy ?? null;
//     }, [geckoScoreState?.energy])

//     return {
//       geckoEnergyLevel,
//       geckoScoreState,
//       loadingGeckoScoreState,
//       geckoScoreStateLoaded,
//     };
//   };
// export default useGeckoScoreState;


  import { useQuery } from "@tanstack/react-query";                                                                                                                                                                                                      
  import useUser from "./useUser";
  import { useMemo } from "react";                                                                                                                                                                                                                       
  import { getGeckoScoreState } from "@/src/calls/api";                                                                                                                                                                                                

  const geckoScoreStateQueryOptions = (userId: number) => ({
    queryKey: ["userGeckoScoreState", userId],
    queryFn: () => getGeckoScoreState(),
    enabled: !!userId,
    retry: 3,
  });

  const msUntilNextWakeFlip = (activeHours: number[] | undefined) => {
    if (!activeHours || activeHours.length === 0) return null;
    const now = new Date();
    const currentHour = now.getHours();
    const isActive = activeHours.includes(currentHour);
    for (let i = 1; i <= 24; i++) {
      const checkHour = (currentHour + i) % 24;
      if (activeHours.includes(checkHour) !== isActive) {
        const target = new Date(now);
        target.setHours(currentHour + i, 0, 0, 0);
        return target.getTime() - now.getTime() + 1000;
      }
    }
    return null;
  };

  const useGeckoScoreState = () => {
    const { user, isInitializing } = useUser();

    const {
      data: geckoScoreState,
      isLoading: loadingGeckoScoreState,
      isSuccess: geckoScoreStateLoaded,
    } = useQuery({
      ...geckoScoreStateQueryOptions(user?.id ?? 0),
      refetchInterval: (query) => {
        const data = query.state.data;
        const candidates: number[] = [];

        if (data?.revives_at) {
          const msUntilRevival = new Date(data.revives_at).getTime() - Date.now();
          candidates.push(msUntilRevival <= 0 ? 1000 : msUntilRevival + 1000);
        }

        const msUntilFlip = msUntilNextWakeFlip(data?.active_hours);
        if (msUntilFlip !== null) candidates.push(msUntilFlip);

        return candidates.length > 0 ? Math.min(...candidates) : false;
      },
    });

    const geckoEnergyLevel = useMemo(
      () => geckoScoreState?.energy ?? null,
      [geckoScoreState?.energy]
    );

    const isAwake = useMemo(() => {
      if (!geckoScoreState?.active_hours) return false;
      return geckoScoreState.active_hours.includes(new Date().getHours());
    }, [geckoScoreState?.active_hours]);

    return {
      geckoEnergyLevel,
      geckoScoreState,
      loadingGeckoScoreState,
      geckoScoreStateLoaded,

      // Back-compat aliases — score state is a superset of the old configs payload
      geckoConfigs: geckoScoreState,
      loadingGeckoConfigs: loadingGeckoScoreState,
      geckoConfigsLoaded: geckoScoreStateLoaded,

      isAwake,
    };
  };

  export default useGeckoScoreState;
