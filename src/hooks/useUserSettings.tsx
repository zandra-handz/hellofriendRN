import { useQuery } from "@tanstack/react-query";

import useUser from "./useUser";
import { getUserSettings } from "@/src/calls/api";


// prefetching in the useUser hook
const useUserSettings = () => {
  const { user, isInitializing } = useUser();

  const {
    data: settings,
    isLoading: loadingSettings,
    isSuccess: settingsLoaded,
  } = useQuery({
    queryKey: ["userSettings", user?.id],
    queryFn: () => getUserSettings(),
    enabled: !!user?.id && !isInitializing, //testing removing this
    retry: 3,
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  return {
    settings,
    loadingSettings,
    settingsLoaded,
  };
};

export default useUserSettings;
