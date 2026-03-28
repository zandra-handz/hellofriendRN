 

// import { useQuery } from "@tanstack/react-query";
// import useUser from "./useUser";
// import { getUserSettings } from "@/src/calls/api";

// const userSettingsQueryOptions = (userId: number) => ({
//   queryKey: ["userSettings", userId],
//   queryFn: () => getUserSettings(),
//   enabled: !!userId,
//   retry: 3, 
// });

// const useUserSettings = () => {
//   const { user, isInitializing } = useUser();

//   const {
//     data: settings,
//     isLoading: loadingSettings,
//     isSuccess: settingsLoaded,
//   } = useQuery({
//     ...userSettingsQueryOptions(user?.id ?? 0),
//     enabled: !!user?.id && !isInitializing,
//   });

//   return {
//     settings,
//     loadingSettings,
//     settingsLoaded,
//   };
// };

// export default useUserSettings;


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useUser from "./useUser";
import { getUserSettings, getUserGeckoConfigs } from "@/src/calls/api";

const userSettingsQueryOptions = (userId: number) => ({
  queryKey: ["userSettings", userId],
  queryFn: () => getUserSettings(),
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
    dataUpdatedAt,
  } = useQuery({
    ...userSettingsQueryOptions(user?.id ?? 0),
    enabled: !!user?.id && !isInitializing,
  });

  useEffect(() => {
    if (dataUpdatedAt && user?.id) {
      queryClient.prefetchQuery({
        queryKey: ["geckoConfigs", user.id],
        queryFn: () => getUserGeckoConfigs(),
      });
    }
  }, [dataUpdatedAt, user?.id, queryClient]);

  return {
    settings,
    loadingSettings,
    settingsLoaded,
  };
};

export default useUserSettings;