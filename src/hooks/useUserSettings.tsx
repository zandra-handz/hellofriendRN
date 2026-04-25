

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useMemo } from "react";
// import useUser from "./useUser";
// import { getUserSettings, getUserGeckoConfigs } from "@/src/calls/api";

//   export type GeckoGameType = {                                                                                                                                                                                                      
//     value: number;                                                                                                                                                                                                                   
//     label: string;                                                                                                                                                                                                                 
//     hidden: boolean;
//     match_only: boolean;
//   };

//   const EMPTY_GAME_TYPES: GeckoGameType[] = [];

// const userSettingsQueryOptions = (userId: number) => ({
//   queryKey: ["userSettings", userId],
//   queryFn: () => getUserSettings(),
//   enabled: !!userId,
//   retry: 3,
// });

// const useUserSettings = () => {
//   const { user, isInitializing } = useUser();
//   const queryClient = useQueryClient();

//   const {
//     data: settings,
//     isLoading: loadingSettings,
//     isSuccess: settingsLoaded,
//     dataUpdatedAt,
//   } = useQuery({
//     ...userSettingsQueryOptions(user?.id ?? 0),
//     enabled: !!user?.id && !isInitializing,
//   });



 
 

//   return {
//     settings,
//    geckoGameTypes: settings?.gecko_game_types ?? EMPTY_GAME_TYPES,

//     loadingSettings,
//     settingsLoaded,

//   };
// };

// export default useUserSettings;


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import useUser from "./useUser";
import { getUserSettings, getUserGeckoConfigs } from "@/src/calls/api";

export type GeckoGameType = {
  value: number;
  label: string;
  hidden: boolean;
  match_only: boolean;
};

const EMPTY_GAME_TYPES: GeckoGameType[] = [];

const userSettingsQueryOptions = (userId: number) => ({
  queryKey: ["userSettings", userId],
  queryFn: () => getUserSettings(),
  enabled: !!userId,
  retry: 3,
});

const geckoScoreStateQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoScoreState", userId],
  queryFn: () => getUserGeckoConfigs(),
  enabled: !!userId,
  retry: 3,
});

const useUserSettings = () => {
  const { user, isInitializing } = useUser();
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading: loadingSettings,
    isSuccess: settingsLoaded,
  } = useQuery({
    ...userSettingsQueryOptions(user?.id ?? 0),
    enabled: !!user?.id && !isInitializing,
  });

  // Prefetch geckoScoreState once we have a valid user
  useEffect(() => {
    if (user?.id) {
      queryClient.prefetchQuery(
        geckoScoreStateQueryOptions(user.id)
      );
    }
  }, [user?.id, queryClient]);

  const geckoGameTypes = useMemo(
    () => settings?.gecko_game_types ?? EMPTY_GAME_TYPES,
    [settings]
  );

  return {
    settings,
    geckoGameTypes,
    loadingSettings,
    settingsLoaded,
  };
};

export default useUserSettings;