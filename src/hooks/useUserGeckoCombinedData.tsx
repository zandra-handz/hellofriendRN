import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";
import { getUserGeckoCombinedData } from "@/src/calls/api";

const userGeckoCombinedDataQueryOptions = (userId: number) => ({
  queryKey: ["userGeckoCombinedData", userId],
  queryFn: () => getUserGeckoCombinedData(),
  enabled: !!userId,
  retry: 3,
});

const useUserGeckoCombinedData = () => {
  const { user, isInitializing } = useUser();

  const {
    data: geckoCombinedData,
    isLoading: loadingGeckoCombinedData,
    isSuccess: geckoCombinedDataLoaded,
  } = useQuery({
    ...userGeckoCombinedDataQueryOptions(user?.id ?? 0),
    enabled: !!user?.id && !isInitializing,
  });

  return {
    geckoCombinedData,
    loadingGeckoCombinedData,
    geckoCombinedDataLoaded,
  };
};

export default useUserGeckoCombinedData;