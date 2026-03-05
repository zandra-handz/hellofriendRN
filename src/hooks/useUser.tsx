 
import React, {  useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signout } from "../calls/helloFriendApiClient";
import { getCurrentUser } from "@/src/calls/api";
// import isEqual from "lodash.isequal";
import * as SecureStore from "expo-secure-store";
 



const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isError,
    isPending,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: false,
    retry: 3,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const onSignOutContextVersion = async () => {
    await signout();
    queryClient.resetQueries(["currentUser"], {
      exact: true,
      refetchActive: false,
    });
    queryClient.removeQueries({ exact: false });
    queryClient.cancelQueries();
  };

  useEffect(() => {
    if (isError) {
      onSignOutContextVersion();
    }
  }, [isError]);

  useEffect(() => {
    (async () => {
      // Check cache first - skip if already have data
      const cachedUser = queryClient.getQueryData(["currentUser"]);
      if (cachedUser) {
        console.log("User already cached, skipping refetch");
        return;
      }

      const storedToken = await SecureStore.getItemAsync("accessToken");
      if (storedToken) {
        console.log("refetching!");
        await refetch();
      } else {
        onSignOutContextVersion();
      }
    })();
  }, []);

  return {
    user,
    isInitializing: isLoading,
    refetch,
  };
};

export default useUser;