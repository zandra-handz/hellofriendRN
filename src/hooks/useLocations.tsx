import React, { useMemo } from "react";
import { useQuery  } from "@tanstack/react-query";
import { fetchAllLocations } from "@/src/calls/api";

type Props = {
  userId: number;
  isInitializing?: boolean;

  enabled: boolean;
};

const useLocations = ({
  userId,
  isInitializing = false,

  enabled = true,  
}: Props) => {
 

  const { data: locationList, isSuccess } = useQuery({
    queryKey: ["locationList", userId],
    queryFn: () => fetchAllLocations(),
    enabled: !!(userId && !isInitializing && enabled),
    staleTime: 1000 * 60 * 120, // 2 hours
  });

 
 

  return {
    locationList,
    locationListIsSuccess: isSuccess,
  };
};

export default useLocations;
