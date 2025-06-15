import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  addToFriendFavesLocations,
  removeFromFriendFavesLocations,
  fetchAllLocations,
  fetchLocationDetails,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../calls/api"; // Import the API methods
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./UserContext"; // Import the AuthUser context

import { useSelectedFriend } from "../context/SelectedFriendContext";

const LocationsContext = createContext([]);

export const useLocations = () => {
  return useContext(LocationsContext);
};

export const LocationsProvider = ({ children }) => {
  const [faveLocationList, setFaveLocationList] = useState([]);
  const [savedLocationList, setSavedLocationList] = useState([]);
  const [validatedLocationList, setValidatedLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingSelectedLocation, setLoadingSelectedLocation] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState(null);
  const [loadingAdditionalDetails, setLoadingAdditionalDetails] =
    useState(false);
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient();
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);

  const { selectedFriend, friendFavesData } = useSelectedFriend();

  const timeoutRef = useRef(null);

  const {
    data: locationList,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["locationList", user?.id],
    queryFn: () => fetchAllLocations(),
    enabled: !!(user && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 20, // 20 minutes
    onSuccess: (data) => {
      //console.log('Raw data in RQ onSuccess:', data);
      if (!data) {
        console.log("No data received");
        return;
      }

      const { validated, saved } = data.reduce(
        (acc, location) => {
          if (location.validatedAddress) {
            acc.validated.push(location); // Add to validated list
          }
          if (!String(location.id).startsWith("temp")) {
            acc.saved.push(location); // Add to saved list
          }
          return acc;
        },
        { validated: [], saved: [] }
      );

      setValidatedLocationList(validated);
      setSavedLocationList(saved);

      queryClient.setQueryData(["locationCategories", user?.id], () => {
        const uniqueCategories = Array.from(
          new Set(
            data
              .map((loc) => loc.category)
              .filter((category) => category !== null && category !== " ")
          )
        );

        return ["All", ...uniqueCategories];
      });
    },
  });

  const filterFaveLocations = (locations, favorites) => {
    //console.log('filterfavelocations', favorites);
    if (locations && favorites) {
      const faveLocations = locations.filter((location) =>
        favorites.includes(location.id)
      );
      //console.log(`fave locations: `, faveLocations);
      setFaveLocationList(faveLocations);
    } else {
      const faveLocations = [];
      //console.log(`fave locations: `, faveLocations);
      setFaveLocationList(faveLocations);
    }
  };

  //THIS IS WHAT FILTERS THE FAVES AND THE DATA COMES FROM THE CACHE IN SELECTEDFRIEND
  useEffect(() => {
    //console.log('use effect for faaaave locations triggered', friendFavesData);
    if (locationList && friendFavesData) {
      //console.log('heading to function');
      const favorites = friendFavesData.friendFaveLocations || null;
      filterFaveLocations(locationList, favorites);
    }
  }, [locationList, friendFavesData]);

  //MIGHT NEED TO REFETCH THIS DATA IF NO LONGER IN CACHE
  useEffect(() => {
    if (locationList) {
      queryClient.setQueryData(["locationCategories", user?.id], (oldData) => {
        // Assuming `location` is an array of objects with a `category` field
        const locationCategories = locationList.map((loc) => loc.category);

        // Create a unique set of categories
        const uniqueCategories = Array.from(new Set(locationCategories));
        //console.log(uniqueCategories);
        // Return the unique categories to set as the new data
        return uniqueCategories;
      });
    }
  }, [locationList]);

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

  const removeFromFavesMutation = useMutation({
    mutationFn: (data) => removeFromFriendFavesLocations(data),
    onSuccess: (data) => {
      const friendData = queryClient.getQueryData([
        "friendDashboardData",
        user?.id,
        selectedFriend?.id,
      ]);

      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (old) => {
          if (!old || !old[0]) {
            return {
              0: {
                friend_faves: {
                  locations: data.locations,
                },
                ...old?.[0],
              },
            };
          }

          const updatedDashboardData = {
            ...old,
            0: {
              ...old[0],
              friend_faves: {
                ...old[0].friend_faves,
                locations: data.locations,
              },
            },
          };

          //console.log(updatedDashboardData);
          return updatedDashboardData;
        }
      );
    },
    onError: (error) => {
      console.error("Error removing location to friend faves:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        removeFromFavesMutation.reset();
      }, 2000);
    },
  });

  const handleRemoveFromFaves = async (friendId, locationId) => {
    const favoriteLocationData = {
      friendId: friendId,
      userId: user.id,
      locationId: locationId,
    };

    try {
      await removeFromFavesMutation.mutateAsync(favoriteLocationData);
    } catch (error) {
      console.error("Error removing location from friend faves: ", error);
    }
  };

  const [locationFaveAction, setLocationFaveAction] = useState(null);

  const addToFavesMutation = useMutation({
    mutationFn: (data) => {
      setLocationFaveAction(data.locationId); // Set the loading state before the mutation starts
      return addToFriendFavesLocations(data);
    },
    onSuccess: (data, variables) => {
      const friendData = queryClient.getQueryData([
        "friendDashboardData",
        user?.id,
        selectedFriend?.id,
      ]);
      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (old) => {
          if (!old || !old[0]) {
            return {
              0: {
                friend_faves: {
                  locations: data.locations,
                },
                ...old?.[0],
              },
            };
          }

          const updatedDashboardData = {
            ...old,
            0: {
              ...old[0],
              friend_faves: {
                ...old[0].friend_faves,
                locations: data.locations,
              },
            },
          };

          setLocationFaveAction(null);

          //console.log(updatedDashboardData);
          return updatedDashboardData;
        }
      );
    },
    onError: (error) => {
      console.error("Error adding location to friend faves:", error);
    },
    onSettled: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        addToFavesMutation.reset();
      }, 2000);
    },
  });

  const handleAddToFaves = async (friendId, locationId) => {
    const favoriteLocationData = {
      friendId: friendId,
      userId: user.id,
      locationId: locationId,
    };

    try {
      await addToFavesMutation.mutateAsync(favoriteLocationData);
    } catch (error) {
      console.error("Error adding location to friend faves: ", error);
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
    setIsDeletingLocation(true);
    const locationData = {
      id: locationId,
      user: user.id,
    };

    //console.log('Payload before sending:', locationData);

    try {
      await deleteLocationMutation.mutateAsync(locationId); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving location:", error);
    }
    setIsDeletingLocation(false);
  };

  //faveLocationList

  //this sorts it faster
  //   useEffect(() => {
  //    if (locationList) {
  //       const { validated, saved } = locationList.reduce((acc, location) => {
  //            if (location.validatedAddress) {
  //                 acc.validated.push(location);  // Add to validated list
  //             }
  //            if (!String(location.id).startsWith('temp')) {
  //                 acc.saved.push(location);
  //             }
  //             return acc;
  //         }, { validated: [], saved: [] });

  //         setValidatedLocationList(validated);
  //        setSavedLocationList(saved);
  //    }
  // }, [locationList]);

  const sortLocationList = () => {
    if (locationList && locationList !== undefined) {
      const { validated, saved } = locationList.reduce(
        (acc, location) => {
          if (location.validatedAddress) {
            acc.validated.push(location); // Add to validated list
          }
          if (!String(location.id).startsWith("temp")) {
            acc.saved.push(location); // Add to saved list
          }
          return acc;
        },
        { validated: [], saved: [] }
      );

      setValidatedLocationList(validated);
      setSavedLocationList(saved);
    }
  };

  const useFetchAdditionalDetails = (location, enabled) => {
    return useQuery({
      queryKey: ["additionalDetails", location?.id],
      enabled: !!(location && location.id && enabled),
      queryFn: async () =>
        fetchLocationDetails({
          address: encodeURIComponent(`${location.title} ${location.address}`),
          lat: parseFloat(location.latitude),
          lon: parseFloat(location.longitude),
        }),

      onError: (err) => {
        console.error("Error fetching location details:", err);
      },
    });
  };
  const clearAdditionalDetails = () => {
    setAdditionalDetails(null);
  };

  const addLocationToFaves = (locationId) => {
    const location = locationList.find((loc) => loc.id === locationId);
    if (location && !faveLocationList.some((loc) => loc.id === locationId)) {
      setFaveLocationList([...faveLocationList, location]);
    }
  };

  const removeLocationFromFaves = (locationId) => {
    const updatedFaves = faveLocationList.filter(
      (loc) => loc.id !== locationId
    );
    setFaveLocationList(updatedFaves);
  };

  return (
    <LocationsContext.Provider
      value={{
        locationList,
        faveLocationList,
        locationsIsFetching,
        isFetching,
        locationListIsSuccess,
        sortLocationList,
        handleCreateLocation,
        createLocationMutation,
        handleUpdateLocation,
        updateLocationMutation,
        handleAddToFaves,
        handleRemoveFromFaves,
        handleDeleteLocation,
        deleteLocationMutation,
        isDeletingLocation,
        isLoading,
        validatedLocationList,
        savedLocationList,
        selectedLocation,
        additionalDetails,
        setSelectedLocation,
        addLocationToFaves,
        addToFavesMutation,
        removeLocationFromFaves,
        removeFromFavesMutation,
        loadingSelectedLocation,
        loadingAdditionalDetails,
        useFetchAdditionalDetails,
        clearAdditionalDetails,

        accessLocationListCacheData,
      }}
    >
      {children}
    </LocationsContext.Provider>
  );
};
