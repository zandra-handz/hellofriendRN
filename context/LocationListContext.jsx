import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { useUpcomingHelloes } from './UpcomingHelloesContext';
import { fetchAllLocations, fetchLocationDetails, createLocation, updateLocation } from '../api'; // Import the API methods
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { addToFriendFavesLocations, removeFromFriendFavesLocations } from '../api'; 

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
   
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

  
  const { data: locationList, isLoading, isError } = useQuery({
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


  const createLocationMutation = useMutation({
    mutationFn: (data) => createLocation(data),
    onSuccess: (data) => {
        // Update the location list immutably, adding the new location at the front
        queryClient.setQueryData(['locationList'], (old) => {
            const updatedList = old ? [data, ...old] : [data];
            return updatedList; // Return the updated list
        });

        // Log the actual locationList after mutation
        const actualLocationList = queryClient.getQueryData(['locationList']);
        console.log('Actual locationList after mutation:', actualLocationList);
    },
});


// Function to handle location creation
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


  useEffect(() => {
    if (selectedLocation) {
      return;
    }
    //checking for if the loading state is false prevents this effect from setting selected location before the initial data load then goes on to
    if (locationList && locationList.length > 0 && loadingSelectedLocation === false) {
      setSelectedLocation(locationList[0]);
      console.log('selected location set in context');
    
    }
  }, []); //locationList, selectedLocation
 

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

  return (
    <LocationListContext.Provider value={{ 
      locationList, 
      handleCreateLocation,
      createLocationMutation,
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
      useFetchAdditionalDetails, // Add this function to the context value
      clearAdditionalDetails // Add this function to the context value
    }}>
      {children}
    </LocationListContext.Provider>
  );
};

export const useLocationList = () => {
  const context = useContext(LocationListContext);
  if (context === undefined) {
    throw new Error('useLocationList must be used within a LocationListProvider');
  }
  return context;
};

export default LocationListContext;
