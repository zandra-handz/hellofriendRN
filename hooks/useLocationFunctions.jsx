import React, { useState, useEffect, useRef } from 'react';
import { addToFriendFavesLocations, removeFromFriendFavesLocations, fetchAllLocations, fetchLocationDetails, createLocation, updateLocation, deleteLocation } from '../api'; // Import the API methods
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '../context/AuthUserContext'; // Import the AuthUser context

import { useSelectedFriend } from '../context/SelectedFriendContext';
 
const useLocationFunctions = () => {
    const [faveLocationList, setFaveLocationList] = useState([]);
    const [savedLocationList, setSavedLocationList] = useState([]);
    const [validatedLocationList, setValidatedLocationList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loadingSelectedLocation, setLoadingSelectedLocation] = useState(false);
    const [additionalDetails, setAdditionalDetails] = useState(null);
    const [loadingAdditionalDetails, setLoadingAdditionalDetails] = useState(false);
    const [isTemp, setIsTemp] = useState(false);
    const [isFave, setIsFave] = useState(false);
    const { authUserState } = useAuthUser(); 
    const queryClient = useQueryClient();
    const [isDeletingLocation, setIsDeletingLocation ] = useState(false);
  
    const { selectedFriend } = useSelectedFriend();



 
    const { data: locationList, isLoading, isFetching, isSuccess, isError } = useQuery({
      queryKey: ['locationList'],
      queryFn: () => fetchAllLocations(),
      enabled: !!authUserState.authenticated,
      onSuccess: (data) => {
          //console.log('Raw data in RQ onSuccess:', data);
          if (!data) {
              console.log('No data received');
              return;
          }
 
   
          const { validated, saved } = data.reduce(
              (acc, location) => {
                  if (location.validatedAddress) {
                      acc.validated.push(location); // Add to validated list
                  }
                  if (!String(location.id).startsWith('temp')) {
                      acc.saved.push(location); // Add to saved list
                  }
                  return acc;
              },
              { validated: [], saved: [] }
          );
  
          setValidatedLocationList(validated);
          setSavedLocationList(saved);

          queryClient.setQueryData(['locationCategories'], () => {
            // Extract categories and create a unique set
            const uniqueCategories = Array.from(new Set(data.map((loc) => loc.category)));
           
            return uniqueCategories;
          });
      },
  });


  useEffect(() => {
    if (locationList) {
      queryClient.setQueryData(['locationCategories'], (oldData) => {
        // Assuming `location` is an array of objects with a `category` field
        const locationCategories = locationList.map((loc) => loc.category);
        
        // Create a unique set of categories
        const uniqueCategories = Array.from(new Set(locationCategories));
        console.log(uniqueCategories);
        // Return the unique categories to set as the new data
        return uniqueCategories;
      });
    }

  }, [locationList]);

  const locationsIsFetching = isFetching;
  
 
    
      const locationListIsSuccess = isSuccess;
     
    
    
      const createLocationMutation = useMutation({
        mutationFn: (data) => createLocation(data),
        onSuccess: (data) => {queryClient.setQueryData(['locationList'], (old) => {
                const updatedList = old ? [data, ...old] : [data];
                return updatedList; 
            });
     
            //const actualLocationList = queryClient.getQueryData(['locationList']);
            //console.log('Actual locationList after mutation:', actualLocationList);
            
          },
        onError: (error) => {
          console.error(error);
        },
    });

    const handleUpdateLocation = async (locationId, locationUpdate) => {
      //console.log('Updating location:', locationId, locationUpdate);
  
      try {
          await updateLocationMutation.mutateAsync({ id: locationId, ...locationUpdate });
      } catch (error) {
          console.error('Error updating location:', error);
      }
  };
    
    
    const updateLocationMutation = useMutation({
      mutationFn: ({ id, ...locationData }) => updateLocation(id, locationData),
      onSuccess: (data) => {
          queryClient.setQueryData(['locationList'], (old) => {
              if (!old) return [data];
              return old.map((location) =>
                  location.id === data.id ? { ...location, ...data } : location
              );
          });
      },
      onError: (error) => {
          console.error('Update failed:', error);
      },
  });
  



    const accessLocationListCacheData = () => {

      if (isSuccess) {

      try {
      const locationCache = queryClient.getQueryData(['locationList']);
      return locationCache;
      } catch (error) {
        console.error('no location cached data');
        return null;
      }
    }
    }

    
    
     
    const handleCreateLocation = async (friends, title, address, parkingTypeText, trimmedCustomTitle, personalExperience) => {
      const locationData = {
          friends: friends,
          title: title,
          address: address,
          parking_score: parkingTypeText,
          custom_title: trimmedCustomTitle,
          personal_experience_info: personalExperience,
          user: authUserState.user.id,
      };
    
      //console.log('Payload before sending:', locationData);
    
      try {
        
          await createLocationMutation.mutateAsync(locationData); // Call the mutation with the location data
      } catch (error) {
          console.error('Error saving location:', error);
      }
    };
    const RESET_DELAY = 1000; 



    const removeFromFavesMutation = useMutation({
      mutationFn: (data) => removeFromFriendFavesLocations(data),
      onSuccess: (data) => {  const friendData = queryClient.getQueryData(['friendDashboardData', selectedFriend?.id]);
        
        queryClient.setQueryData(['friendDashboardData', selectedFriend?.id], (old) => {
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
      });
      
      },
      onError: (error) => { 
        console.error('Error removing location to friend faves:', error);
    },
    onSettled: () => {  
      setTimeout(() => {
        
        removeFromFavesMutation.reset();
      }, RESET_DELAY);
  },
    })


    const handleRemoveFromFaves = async (friendId, locationId) => {
      const favoriteLocationData = {
        friendId: friendId,
        userId: authUserState.user.id, 
        locationId: locationId
      };

      try {
        await removeFromFavesMutation.mutateAsync(favoriteLocationData);


      } catch (error) {
        console.error('Error removing location from friend faves: ', error);
      }
    }

    const addToFavesMutation = useMutation({
      mutationFn: (data) => addToFriendFavesLocations(data),
      onSuccess: (data) => {  const friendData = queryClient.getQueryData(['friendDashboardData', selectedFriend?.id]);
         queryClient.setQueryData(['friendDashboardData', selectedFriend?.id], (old) => {
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
      });
      
      },
      onError: (error) => {
        console.error('Error adding location to friend faves:', error);
    },
    onSettled: () => {  
      setTimeout(() => {
          addToFavesMutation.reset();
      }, RESET_DELAY);
  },
    })
    
    const handleAddToFaves = async (friendId, locationId) => {
      const favoriteLocationData = {
        friendId: friendId,
        userId: authUserState.user.id, 
        locationId: locationId
      };

      try {
        await addToFavesMutation.mutateAsync(favoriteLocationData);


      } catch (error) {
        console.error('Error adding location to friend faves: ', error);
      }
    }

    const deleteLocationMutation = useMutation({
      mutationFn: (data) => deleteLocation(data),

      onSuccess: (data) => { 
        queryClient.setQueryData(['locationList'], (old) => {
              const updatedList = old ? old.filter((location) => location.id !== data.id) : [];
              return updatedList;
          });
           
          queryClient.invalidateQueries(['locationList']);
          
          //console.log('Successfully deleted location:', data);
      },
      onError: (error) => {
          console.error('Error deleting location:', error);
      },
      onSettled: () => {  
          setTimeout(() => {
              deleteLocationMutation.reset();
          }, RESET_DELAY);
      },
    });
    
    
    const handleDeleteLocation = async (locationId) => {
      setIsDeletingLocation(true);
      const locationData = {
          id: locationId,
          user: authUserState.user.id,
      };
    
      //console.log('Payload before sending:', locationData);
    
      try {
        
          await deleteLocationMutation.mutateAsync(locationId); // Call the mutation with the location data
      } catch (error) {
          console.error('Error saving location:', error);
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
                if (!String(location.id).startsWith('temp')) {
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
  const queryClient = useQueryClient();  
 
  return useQuery({
    queryKey: ['additionalDetails', location?.id], 
    queryFn: async () => {
      //console.log(location);
      if (location && location.id) { 
        const cachedData = queryClient.getQueryData(['additionalDetails', location.id]);
        if (cachedData) {
          //console.log('Cache hit for location:', location.id);
          //console.log('Cached data:', cachedData);
          return cachedData;  
        }

        //console.log('Cache miss for location:', location.id); 
        const details = await fetchLocationDetails({
          address: encodeURIComponent(`${location.title} ${location.address}`),
          lat: parseFloat(location.latitude),
          lon: parseFloat(location.longitude),
        });

        //console.log('Fetched additional location details...');
        return details;
      } else {
        console.log('No location provided. Returning null.');
        return null;
      }
    },
    enabled, 
    onError: (err) => {
      console.error('Error fetching location details:', err);
    },
  });
};
      const clearAdditionalDetails = () => {
        setAdditionalDetails(null);
      };
     
    
      const addLocationToFaves = (locationId) => {
        const location = locationList.find(loc => loc.id === locationId);
        if (location && !faveLocationList.some(loc => loc.id === locationId)) {
          setFaveLocationList([...faveLocationList, location]);
        }
      };
    
      const removeLocationFromFaves = (locationId) => {
        const updatedFaves = faveLocationList.filter(loc => loc.id !== locationId);
        setFaveLocationList(updatedFaves);
      };

    return { 
        locationList,
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
        removeLocationFromFaves,  
        loadingSelectedLocation,
        loadingAdditionalDetails, 
        useFetchAdditionalDetails,  
        clearAdditionalDetails,

        accessLocationListCacheData
    };

}


export default useLocationFunctions;