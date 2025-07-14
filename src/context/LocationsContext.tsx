import React, {
  createContext,
  useContext,
  useState, 
  useCallback,
  useMemo,
  useRef,
} from "react";
import { 
  fetchAllLocations,
  fetchLocationDetails,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../calls/api"; // Import the API methods
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./UserContext";  

const LocationsContext = createContext([]);

export const useLocations = () => {
  return useContext(LocationsContext);
};

export const LocationsProvider = ({ children }) => {
  const [faveLocationList, setFaveLocationList] = useState([]); 
 
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient(); 
  const [stickToLocation, setStickToLocation] = useState(null); 

  const timeoutRef = useRef(null);

  // console.log("LOCATION CONTEXT RERENDERED");

  const {
    data: locationList,
    isLoading,
    isFetching,
    isSuccess, 
  } = useQuery({
    queryKey: ["locationList", user?.id],
    queryFn: () => fetchAllLocations(),
    enabled: !!(isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 20, // 20 minutes
    
 
  });
 


  
  //MIGHT NEED TO REFETCH THIS DATA IF NO LONGER IN CACHE
  // useEffect(() => {
  //   if (locationList) {
  //     queryClient.setQueryData(["locationCategories", user?.id], (oldData) => { 
  //       const locationCategories = locationList.map((loc) => loc.category);
 
  //       const uniqueCategories = Array.from(new Set(locationCategories));
 
  //       return uniqueCategories;
  //     });
  //   }
  // }, [locationList]);

  const locationsIsFetching = isFetching;

  const locationListIsSuccess = isSuccess;

  const createLocationMutation = useMutation({
    mutationFn: (data) => createLocation(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["locationList", user?.id], (old) => {
        const updatedList = old ? [data, ...old] : [data];
        return updatedList;
      });

      //const actualLocationList = queryClient.getQueryData(['locationList']);
      //console.log('Actual locationList after mutation:', actualLocationList);

      //             if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }

      //                               timeoutRef.current = setTimeout(() => {
      //     createLocationMutation.reset();
      // }, 2000);
    },
    onError: (error) => {
      console.error(error);

      //           if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }
      //                             timeoutRef.current = setTimeout(() => {
      //     createLocationMutation.reset();
      // }, 2000);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        createLocationMutation.reset();
      }, 2000);
    },
  });

  const handleUpdateLocation = async (locationId, locationUpdate) => {
    //console.log('Updating location:', locationId, locationUpdate);

    try {
      await updateLocationMutation.mutateAsync({
        id: locationId,
        ...locationUpdate,
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, ...locationData }) => updateLocation(id, locationData),
    onSuccess: (data) => {
      queryClient.setQueryData(["locationList", user?.id], (old) => {
        if (!old) return [data];
        return old.map((location) =>
          location.id === data.id ? { ...location, ...data } : location
        );
      });
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateLocationMutation.reset();
      }, 2000);
    },
  });

  const accessLocationListCacheData = () => {
    if (isSuccess) {
      try {
        const locationCache = queryClient.getQueryData([
          "locationList",
          user?.id,
        ]);
        return locationCache;
      } catch (error) {
        console.error("no location cached data");
        return null;
      }
    }
  };

  const handleCreateLocation = async (
    friends,
    title,
    address,
    parkingTypeText,
    trimmedCustomTitle,
    personalExperience
  ) => {
    const locationData = {
      friends: friends,
      title: title,
      address: address,
      parking_score: parkingTypeText,
      custom_title: trimmedCustomTitle,
      personal_experience_info: personalExperience,
      user: user.id,
    };

    //console.log('Payload before sending:', locationData);

    try {
      await createLocationMutation.mutateAsync(locationData); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };
 

 

 
  const deleteLocationMutation = useMutation({
    mutationFn: (data) => deleteLocation(data),

    onSuccess: (data) => {
      queryClient.setQueryData(["locationList", user?.id], (old) => {
        const updatedList = old
          ? old.filter((location) => location.id !== data.id)
          : [];
        return updatedList;
      });

      queryClient.invalidateQueries(["locationList", user?.id]);
    },
    onError: (error) => {
      console.error("Error deleting location:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        deleteLocationMutation.reset();
      }, 2000);
    },
  });

  const handleDeleteLocation = async (locationId) => {
    // setIsDeletingLocation(true);
 

    //console.log('Payload before sending:', locationData);

    try {
      await deleteLocationMutation.mutateAsync(locationId); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving location:", error);
    }
    // setIsDeletingLocation(false);
  }; 

  const useFetchAdditionalDetails = (location, enabled) => {
    return useQuery({
      queryKey: ["additionalDetails", location?.id],
      enabled: !!(location && location.id && enabled),
       staleTime: 1000 * 60 * 20, // 20 minutes
      queryFn: async () =>
        fetchLocationDetails({
          address: encodeURIComponent(`${location.title} ${location.address}`),
          lat: parseFloat(location.latitude),
          lon: parseFloat(location.longitude),
        }), 
    });
  };

 


const getCachedAdditionalDetails = useCallback(
  (locationId) => {
    return queryClient.getQueryData(["additionalDetails", locationId]);
  },
  [queryClient]
);

const addLocationToFaves = useCallback(
  (locationId) => {
    const location = locationList.find((loc) => loc.id === locationId);
    if (location && !faveLocationList.some((loc) => loc.id === locationId)) {
      setFaveLocationList([...faveLocationList, location]);
    }
  },
  [locationList, faveLocationList, setFaveLocationList]
);

const removeLocationFromFaves = useCallback(
  (locationId) => {
    const updatedFaves = faveLocationList.filter((loc) => loc.id !== locationId);
    setFaveLocationList(updatedFaves);
  },
  [faveLocationList, setFaveLocationList]
);


  const contextValue = useMemo(() => ({
  locationList,
  locationsIsFetching,
  isFetching,
  locationListIsSuccess,
  handleCreateLocation,
  createLocationMutation,
  handleUpdateLocation,
  updateLocationMutation,
  handleDeleteLocation,
  deleteLocationMutation, 
  isLoading, 
  addLocationToFaves,
  removeLocationFromFaves,  
  useFetchAdditionalDetails, 
  accessLocationListCacheData,
  stickToLocation,
  setStickToLocation,
  getCachedAdditionalDetails,
}), [
  locationList,
  //locationsIsFetching,
  isFetching,
  locationListIsSuccess,
  handleCreateLocation,
  createLocationMutation,
  handleUpdateLocation,
  updateLocationMutation,
  handleDeleteLocation,
  deleteLocationMutation, 
  isLoading, 
  addLocationToFaves,
  removeLocationFromFaves,  
  useFetchAdditionalDetails, 
  accessLocationListCacheData,
  stickToLocation,
  setStickToLocation,
  getCachedAdditionalDetails,
]);


  return (
     <LocationsContext.Provider value={contextValue}>
    {children}
  </LocationsContext.Provider>
  );
};
