// import { useQuery } from "@tanstack/react-query";

// import useUser from "./useUser";
// import { getUserSettings } from "@/src/calls/api";

// // prefetching in the useUser hook
// const useUserSettings = () => {
//   const { user, isInitializing } = useUser();

//   const {
//     data: settings,
//     isLoading: loadingSettings,
//     isSuccess: settingsLoaded,
//   } = useQuery({
//     queryKey: ["userSettings", user?.id ?? 0],
//     enabled: !!user?.id && !isInitializing,
//     queryFn: () => getUserSettings(),
//     retry: 3,
//     staleTime: 1000 * 60 * 60 * 10, // 10 hours
//   });

//   return {
//     settings,
//     loadingSettings,
//     settingsLoaded,
//   };
// };

// export default useUserSettings;

import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";
import { getUserSettings } from "@/src/calls/api";

const userSettingsQueryOptions = (userId: number) => ({
  queryKey: ["userSettings", userId],
  queryFn: () => getUserSettings(),
  enabled: !!userId,
  retry: 3,
 // staleTime: 1000 * 60 * 60 * 10,
});

const useUserSettings = () => {
  const { user, isInitializing } = useUser();

  const {
    data: settings,
    isLoading: loadingSettings,
    isSuccess: settingsLoaded,
  } = useQuery({
    ...userSettingsQueryOptions(user?.id ?? 0),
    enabled: !!user?.id && !isInitializing,
  });

  return {
    settings,
    loadingSettings,
    settingsLoaded,
  };
};

export default useUserSettings;