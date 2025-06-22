import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetTravelComparisons } from "@/src/calls/api";

//should move the friend/user results data and/or the combined data into separate function
//or set/return a different way

const useTravelTimes = (
  userAddress,
  friendAddress,
  location,
  enableFetching
) => {
  const queryClient = useQueryClient();

  const [enableFetch, setEnableFetch] = useState(enableFetching);

  const toggleFetch = () => {
    if (enableFetch) {
      setEnableFetch(false);
    } else {
      setEnableFetch(true);
    }
  };

  const isInputValid =
    userAddress?.address && friendAddress?.address && location?.address;

  const {
    data: travelTimeResults,
    isSuccess,
    isLoading: isTravelTimesLoading,
    isPending: isTravelTimesPending,
  } = useQuery({
    queryFn: () => GetTravelComparisons(userAddress, friendAddress, location),
    queryKey: [
      "travelTimes",
      userAddress?.address,
      friendAddress?.address,
      location?.address,
    ],
    enabled: !!(isInputValid && enableFetch),
    staleTime: 1000 * 60 * 60, // one hour
  });

  const cachedData = queryClient.getQueryData([
    "travelTimes",
    userAddress?.address,
    friendAddress?.address,
    location?.address,
  ]);

  // useEffect(() => {

  //     if (isSuccess) {
  //         console.log(travelTimeResults);
  //     }
  // }, [isSuccess]);

  return {
    cachedData,

    travelTimeResults,
    isTravelTimesLoading,
    isTravelTimesPending,
    toggleFetch,
  };
};

export default useTravelTimes;
