import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { useUpcomingHelloes } from './UpcomingHelloesContext';
import { fetchAllLocations, fetchLocationDetails, updateLocation } from '../api'; // Import the API methods
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




  useEffect(() => {
    if (selectedLocation) {
      return;
    }
    //checking for if the loading state is false prevents this effect from setting selected location before the initial data load then goes on to
    if (locationList && locationList.length > 0 && loadingSelectedLocation === false) {
      setSelectedLocation(locationList[0]);
      console.log('selected location set in context');
    
    }
  }, [locationList]); //selectedLocation
 

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
  }, [selectedLocation]); // Removed faveLocationList from dependencies
  //faveLocationList

  useEffect(() => {
    if (locationList) {
        const { validated, temp, saved } = locationList.reduce((acc, location) => {
            if (location.validatedAddress) {
                acc.validated.push(location);  // Add to validated list
            }
            if (String(location.id).startsWith('temp')) {
                acc.temp.push(location);  // Add to temp list
            }
            if (!String(location.id).startsWith('temp')) {
                acc.saved.push(location);  // Add to saved list
                if (location.validatedAddress) {
                    acc.validated.push(location);  // Add to validated list if also validated
                }
            }
            return acc;
        }, { validated: [], temp: [], saved: [] });
        
        setValidatedLocationList(validated);
        setTempLocationList(temp);
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
      isLoading, 
      validatedLocationList, 
      faveLocationList, 
      tempLocationList,
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
