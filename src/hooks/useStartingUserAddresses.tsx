import React, { useEffect, useState } from "react";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";
import { 
  fetchUserAddresses,
} from "@/src/calls/api";
 

import { useQuery  } from "@tanstack/react-query";

// Geocoder.init(GOOGLE_API_KEY);

type Props = {
  userId: number;
};

const useStartingUserAddresses = ({ userId }: Props) => {
  const [defaultUserAddress, setDefaultUserAddress] = useState(null);

 

  const { data: userAddresses = [] } = useQuery({
    queryKey: ["userAddresses", userId],
    queryFn: () => fetchUserAddresses(),
    enabled: !!userId, // testing removing this && !isInitializing),  isInitializing may cause infinite regression ?
    staleTime: 1000 * 60 * 20, // 20 minutes
  });

  // useEffect(() => {
  //   if (userAddresses && userAddresses.length > 0) {
  //     if (currentLocationDetails) {
  //       setDefaultUserAddress(currentLocationDetails);
  //     } else {
  //       const defaultAddress = userAddresses.find(
  //         (address) => address.is_default === true
  //       );

  //       if (defaultAddress) {
  //         setDefaultUserAddress(defaultAddress);
  //       } else if (userAddresses.length > 0) {
  //         setDefaultUserAddress(userAddresses[0]);
  //       } else {
  //         setDefaultUserAddress(null);
  //       }
  //     }
  //   }
  // }, [userAddresses]);

  return {
    userAddresses,
    defaultUserAddress,
  };
};

export default useStartingUserAddresses;
