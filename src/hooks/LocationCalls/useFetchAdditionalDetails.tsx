import { View, Text } from "react-native";
import React, { useCallback } from "react";
import { fetchLocationDetails } from "@/src/calls/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Location {
  title: string;
  address: string;
  id: string;
  latitude: string;
  longitude: string;
}

type Props = {
  userId: string;
  locatioObject: Location;
  enabled: boolean;
};

const useFetchAdditionalDetails = ({
  userId,
  locationObject,
  enabled,
}: Props) => {
  const queryClient = useQueryClient();

  const { data: additionalDetails, isLoading: detailsLoading, isPending } = useQuery({
    queryKey: ["additionalDetails", userId, locationObject?.id], // add user id after everything else is working
    enabled: !!(userId && locationObject?.id && enabled),
    staleTime: 1000 * 60 * 120, // 2 hours
    queryFn: async () =>
      fetchLocationDetails({
        address: encodeURIComponent(
          `${locationObject?.title} ${locationObject?.address}`
        ),
        lat: parseFloat(locationObject?.latitude),
        lon: parseFloat(locationObject?.longitude),
      }),
  });

//   const getCachedAdditionalDetails = useCallback(
//     (locationId) => {
//       return queryClient.getQueryData(["additionalDetails", locationId]);
//     },
//     [queryClient]
//   );

  return { detailsLoading, additionalDetails };
};

export default useFetchAdditionalDetails;
