import React from "react";
// import Geocoder from "react-native-geocoding";
// import { GOOGLE_API_KEY } from "@env";
import { 
  fetchUserAddresses,
} from "@/src/calls/api";
 

import { useQuery  } from "@tanstack/react-query";

// Geocoder.init(GOOGLE_API_KEY);

type Props = {
  userId: number;
};

const useStartingUserAddresses = ({ userId }: Props) => { 

 

  const { data: userAddresses = [] } = useQuery({
    queryKey: ["userAddresses", userId],
    queryFn: () => fetchUserAddresses(),
    enabled: !!userId, // testing removing this && !isInitializing),  isInitializing may cause infinite regression ?
    staleTime: 1000 * 60 * 20, // 20 minutes
  });
 

  return {
    userAddresses, 
  };
};

export default useStartingUserAddresses;
