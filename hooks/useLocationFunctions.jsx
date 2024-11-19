import React, { useState, useEffect, useRef } from 'react';
import { fetchAllLocations, fetchLocationDetails, createLocation, deleteLocation } from '../api'; // Import the API methods
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '../context/AuthUserContext'; // Import the AuthUser context
import { useMessage } from '../context/MessageContext';


const useLocationFunctions = () => {
    const [faveLocationList, setFaveLocationList] = useState([]);
    const [tempLocationList, setTempLocationList] = useState([]);
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
  
    const { showMessage } = useMessage();
 
    const { data: locationList, isLoading, isFetching, isError } = useQuery({
        queryKey: ['locationList'],
        queryFn: () => fetchAllLocations(),
        enabled: !!authUserState.authenticated,
        onSuccess: (data) => {
          console.log('Raw data in RQ onSuccess:', data);
          if (!data) {
              console.log('No data received');
              return;
          }
        }
      });
    
      //runs on mount only, sets selectedLocation to the first location in locationList by default
      //useEffect(() => {
       // if (selectedLocation) {
        //  return;
       // }
        //(NOT SURE IF TRU POST RQ!!) checking for if the loading state is false prevents this effect from setting selected location before the initial data load then goes on to
       // if (locationList && locationList.length > 0 && loadingSelectedLocation === false) {
        //  setSelectedLocation(locationList[0]);
        //  console.log('selected location set in context');
        
       // }
      //}, []); //locationList, selectedLocation
    
    
      const createLocationMutation = useMutation({
        mutationFn: (data) => createLocation(data),
        onSuccess: (data) => {queryClient.setQueryData(['locationList'], (old) => {
                const updatedList = old ? [data, ...old] : [data];
                return updatedList; 
            });
     
            const actualLocationList = queryClient.getQueryData(['locationList']);
            console.log('Actual locationList after mutation:', actualLocationList);
        },
    });
    
     
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
    
      console.log('Payload before sending:', locationData);
    
      try {
        
          await createLocationMutation.mutateAsync(locationData); // Call the mutation with the location data
      } catch (error) {
          console.error('Error saving location:', error);
      }
    };
    const RESET_DELAY = 1000; 
    
    
    const deleteLocationMutation = useMutation({
      mutationFn: (data) => deleteLocation(data),
      onSuccess: (data) => {
        // Remove from cache
        queryClient.setQueryData(['locationList'], (old) => {
              const updatedList = old ? old.filter((location) => location.id !== data.id) : [];
              return updatedList;
          });
          
          // Invalidate the cache to trigger new fetch
          queryClient.invalidateQueries(['locationList']);
          
          console.log('Successfully deleted location:', data);
      },
      onError: (error) => {
          console.error('Error deleting location:', error);
      },
      onSettled: () => {
          // Delay resetting mutation state
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
    
      console.log('Payload before sending:', locationData);
    
      try {
        
          await deleteLocationMutation.mutateAsync(locationId); // Call the mutation with the location data
      } catch (error) {
          console.error('Error saving location:', error);
      }
      setIsDeletingLocation(false);
    };
    
    
    
    
     
    
      //sets temp or fave when a location is selected
      useEffect(() => {
        if (selectedLocation && selectedLocation.id) {
          const isTemp = String(selectedLocation.id).startsWith('temp');
          setIsTemp(isTemp);
          
          if (!isTemp) {
            setIsFave(faveLocationList.some(location => location.id === selectedLocation.id));
          } else {
            setIsFave(false);
          }
        } else {
          setIsTemp(false);
          setIsFave(false);
        }
      }, [selectedLocation, faveLocationList]); // Removed faveLocationList from dependencies
      //faveLocationList
    
      useEffect(() => { 
        if (locationList) {
            const { validated, saved } = locationList.reduce((acc, location) => {
                if (location.validatedAddress) {
                    acc.validated.push(location);  // Add to validated list
                } 
                if (!String(location.id).startsWith('temp')) {
                    acc.saved.push(location);
                }
                return acc;
            }, { validated: [], saved: [] });
            
            setValidatedLocationList(validated); 
            setSavedLocationList(saved);
        }
    }, [locationList]);
    
     
    
    const useFetchAdditionalDetails = (location, enabled) => {
        return useQuery({
          queryKey: ['additionalDetails', location?.id], // Unique key based on location ID
          queryFn: async () => {
            if (location && location.id) {
              const details = await fetchLocationDetails({
                address: encodeURIComponent(`${location.title} ${location.address}`),
                lat: parseFloat(location.latitude),
                lon: parseFloat(location.longitude),
              });
              console.log('Fetched additional location details...');
              return details;
            } else {
              console.log('No location provided. Returning null.');
              return null;
            }
          },
          enabled, // Only run the query if enabled is true
          onError: (err) => {
            console.error('Error fetching location details:', err);
          },
        });
      };
      const clearAdditionalDetails = () => {
        setAdditionalDetails(null);
      };
    
    const populateFaveLocationsList = (locationIds) => {
        const favoriteLocations = locationList.filter(location => locationIds.includes(location.id));
        if (JSON.stringify(faveLocationList) !== JSON.stringify(favoriteLocations)) {
            setFaveLocationList(favoriteLocations);
        }
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
        isFetching,
        handleCreateLocation,
        createLocationMutation,
        handleDeleteLocation,
        deleteLocationMutation,
        isDeletingLocation,
        isLoading, 
        validatedLocationList, 
        faveLocationList, 
        tempLocationList,
        setTempLocationList,
        savedLocationList,
        selectedLocation, 
        additionalDetails, 
        setSelectedLocation, 
        populateFaveLocationsList, 
        addLocationToFaves, 
        removeLocationFromFaves,  
        loadingSelectedLocation,
        loadingAdditionalDetails,
        isTemp, 
        isFave,
        useFetchAdditionalDetails,  
        clearAdditionalDetails 
    };

}


export default useLocationFunctions;