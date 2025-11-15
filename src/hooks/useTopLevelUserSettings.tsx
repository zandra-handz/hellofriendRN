import { useQuery } from "@tanstack/react-query";

// import useUser from "./useUser";
import { getUserSettings } from "@/src/calls/api";

const useTopLevelUserSettings = ({userId, isInitializing}) => {
//   const { user, isInitializing } = useUser();

  const {
    data: settings,
    isLoading: loadingSettings,
    isSuccess: settingsLoaded,
  } = useQuery({
    queryKey: ["userSettings", userId],
    queryFn: () => getUserSettings(),
    enabled: !!userId && !isInitializing, //testing removing this
    retry: 3,
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  return {
    settings,
    loadingSettings,
    settingsLoaded,
  };
};

export default useTopLevelUserSettings;
