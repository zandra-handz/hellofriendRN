 
import React, {  useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signout } from "../calls/helloFriendApiClient";
import { getCurrentUser } from "@/src/calls/api";
// import isEqual from "lodash.isequal";
import * as SecureStore from "expo-secure-store";

export interface CategoryType {
  id: number;
  name: string;
  // add other fields here if needed
}

type Props = {
  userId: number;
  isInitializing?: boolean;

  enabled: boolean;
};

const useUser = () => {
  const queryClient = useQueryClient(); 

  const {
    data: user,
    isError,
    isPending, //this is just pre-fetch
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: false, // never auto-run
    retry: 3,
  });


  const onSignOutContextVersion = async () => { //leaving 'context' in for right now, technically it is 'hook' version
     
    await signout();

    queryClient.resetQueries(["currentUser"], {
      exact: true,
      refetchActive: false,
    });

    queryClient.removeQueries({ exact: false }); // removes all queries
    queryClient.cancelQueries();
  };

    useEffect(() => {
      if (isError) {
        onSignOutContextVersion();
        // onSignOut();
      }
    }, [isError]);

      useEffect(() => {
        (async () => {
          const storedToken = await SecureStore.getItemAsync("accessToken");
          if (storedToken) {
            // console.log('refetching!')
            await refetch();
          } else {
            // console.log('not refetching')
            // onSignOut();
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
