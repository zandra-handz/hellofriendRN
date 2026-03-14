// import { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { signout } from "../calls/helloFriendApiClient";
// import {
//   getCurrentUser,
//   fetchUpcomingHelloesAndFriends,
//   getUserSettings,
// } from "@/src/calls/api";
// import * as SecureStore from "expo-secure-store";

// const useUser = () => {
//   const queryClient = useQueryClient();
//   const [hasCheckedToken, setHasCheckedToken] = useState(false);

//   const {
//     data: user,
//     isError,
//     isPending,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["currentUser"],
//     queryFn: getCurrentUser,
//     enabled: false,
//     retry: 3,
//     staleTime: 1000 * 60 * 60,
//   });

//   const onSignOutContextVersion = async () => {
//     await signout();
//     // queryClient.resetQueries(["currentUser"], {
//     //   exact: true,
//     //   refetchActive: false,
//     // });

//     queryClient.resetQueries({
//       queryKey: ["currentUser"],
//       exact: true,
//     });
//     queryClient.removeQueries({ exact: false });
//     queryClient.cancelQueries();
//   };

//   useEffect(() => {
//     if (isError) {
//       onSignOutContextVersion();
//     }
//   }, [isError]);

//   useEffect(() => {
//     (async () => {
//       const cachedUser = queryClient.getQueryData(["currentUser"]);
//       if (cachedUser) {
//         // console.log("User already cached, skipping refetch");
//         setHasCheckedToken(true);
//         return;
//       }

//       const storedToken = await SecureStore.getItemAsync("accessToken");
//       if (storedToken) {
//         console.log("refetching!");
//         const result = await refetch();
//         const userId = result.data?.id;
//         if (userId) {
//           queryClient.prefetchQuery({
//             queryKey: ["friendListAndUpcoming", userId],
//             queryFn: () => fetchUpcomingHelloesAndFriends(),
//             staleTime: 1000 * 60 * 60,
//           });
//           queryClient.prefetchQuery({
//             queryKey: ["userSettings", userId],
//             queryFn: () => getUserSettings(),
//             staleTime: 1000 * 60 * 60 * 10,
//           });
//         }
//       } else {
//         await onSignOutContextVersion();
//       }

//       setHasCheckedToken(true);
//     })();
//   }, []);

//   return {
//     user,
//     isInitializing: isLoading,
//     userIsPending: !hasCheckedToken,

//     refetch,
//   };
// };

// export default useUser;

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signout } from "../calls/helloFriendApiClient";
import {
  getCurrentUser,
  fetchUpcomingHelloesAndFriends,
  getUserSettings,
} from "@/src/calls/api";
import * as SecureStore from "expo-secure-store";

const currentUserQueryOptions = {
  queryKey: ["currentUser"],
  queryFn: getCurrentUser,
  enabled: false,
  retry: 3,
 // staleTime: 1000 * 60 * 60,
} as const;

const useUser = () => {
  const queryClient = useQueryClient();
  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  const {
    data: user,
    isError,
    isPending,
    isLoading,
    refetch,
  } = useQuery(currentUserQueryOptions);

const onSignOutContextVersion = async () => {
  // console.log('SIGNOUT CALLED FROM:', new Error().stack);
  await signout();
  queryClient.clear();
};
  useEffect(() => {
    if (isError) {
      onSignOutContextVersion();
    }
  }, [isError]);

  useEffect(() => {
    (async () => {
      const cachedUser = queryClient.getQueryData(["currentUser"]);
      if (cachedUser) {
        setHasCheckedToken(true);
        return;
      }

      const storedToken = await SecureStore.getItemAsync("accessToken");
      if (storedToken) {
        console.log("refetching!");
        const result = await refetch();
        const userId = result.data?.id;
        if (userId) {
          queryClient.prefetchQuery({
            queryKey: ["friendListAndUpcoming", userId],
            queryFn: () => fetchUpcomingHelloesAndFriends(),
            staleTime: 1000 * 60 * 60,
          });
          queryClient.prefetchQuery({
            queryKey: ["userSettings", userId],
            queryFn: () => getUserSettings(),
            staleTime: 1000 * 60 * 60 * 10,
          });
        }
      } else {
        await onSignOutContextVersion();
      }

      setHasCheckedToken(true);
    })();
  }, []);

  return {
    user,
    isInitializing: isLoading,
    userIsPending: !hasCheckedToken,
    refetch,
  };
};

export default useUser;
