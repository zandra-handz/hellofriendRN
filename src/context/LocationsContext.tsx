import React, {
  createContext,
  useContext,
  useMemo, 
} from "react";
import {
  fetchAllLocations,
} from "../calls/api"; // Import the API methods
import { useQuery  } from "@tanstack/react-query";
import { useUser } from "./UserContext";

const LocationsContext = createContext([]);

export const useLocations = () => {
  return useContext(LocationsContext);
};

export const LocationsProvider = ({ children }) => { 
  const { user } = useUser();
 

  // console.log("LOCATION CONTEXT RERENDERED");

  const {
    data: locationList,
    // isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["locationList", user?.id],
    queryFn: () => fetchAllLocations(),
    enabled: !!user?.id,
    // enabled: false,
    staleTime: 1000 * 60 * 120, // 2 hours
  });
  
 
 
 

  const contextValue = useMemo(
    () => ({
      locationList, 
      locationListIsSuccess: isSuccess, 
    }),
    [
      locationList, 
      // isFetching,
      isSuccess, 
    ]
  );

  return (
    <LocationsContext.Provider value={contextValue}>
      {children}
    </LocationsContext.Provider>
  );
};
