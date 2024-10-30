import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { useUpcomingHelloes } from './UpcomingHelloesContext';
import { fetchAllLocations, fetchLocationDetails, updateLocation } from '../api'; // Import the API methods
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);
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
  const { upcomingHelloes, isLoading } = useUpcomingHelloes(); // Access isLoading from UpcomingHelloesContext
  const queryClient = useQueryClient();

  const extractZipCode = (address) => {
    const zipCodePattern = /(?:\b\d{5}(?:-\d{4})?\b)/;
    const cleanedAddress = address.replace(/^\d+\s*/, '');
    const match = cleanedAddress.match(zipCodePattern);
    return match ? match[0] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (upcomingHelloes && !isLoading) {  // Wait until upcomingHelloes is loaded
        setLoadingSelectedLocation(true);
        try {
          const locationData = await fetchAllLocations();
          
          // Using Promise.all to handle async operations inside map
          const updatedLocationData = await Promise.all(locationData.map(async location => {
            let zipCode = location.zipCode;
            
            // Extract zip code only if it's null
            if (!zipCode) {
              zipCode = extractZipCode(location.address);

              if (zipCode) {
                const newLocationData = {
                  zip_code: zipCode,
                  user: authUserState.user.id,
                };

                const response = await updateLocation(location.id, newLocationData);
                console.log('Response from updating location:', response);
              }
            }

            return {
              ...location,
              zipCode,
            };
          }));

          setLocationList(updatedLocationData);
          setLoadingSelectedLocation(false);

          if (updatedLocationData.length > 0) {
            setSelectedLocation(updatedLocationData[0]);
            console.log('context set selected location initially');
          } else {
            setSelectedLocation(null);
            console.log('context did not set selected location initially');
          }

        } catch (error) {
          console.error('Error fetching location list:', error);
          setLoadingSelectedLocation(false);  // Set to false on error
        }
      }
    };

    if (authUserState.authenticated && !isLoading) { // Ensure that the locations only fetch after upcomingHelloes has loaded
      fetchData();
    } else {
      setLocationList([]);
      setSelectedLocation(null); // Clear selectedLocation if not authenticated
    }
  }, [authUserState.authenticated, isLoading, upcomingHelloes]); // Include isLoading in dependencies
  
  useEffect(() => {
    if (selectedLocation) {
      return;
    }
    //checking for if the loading state is false prevents this effect from setting selected location before the initial data load then goes on to
    if (locationList.length > 0 && loadingSelectedLocation === false) {
      setSelectedLocation(locationList[0]);
      console.log('selected location set in context');
    
    }
  }, [locationList, selectedLocation]);

  useEffect(() => {
    setValidatedLocationList(locationList.filter(location => location.validatedAddress));
  }, [locationList]);

  useEffect(() => {
    if (selectedLocation && selectedLocation.id) {
      setIsTemp(String(selectedLocation.id).startsWith('temp'));
    } else {
      setIsTemp(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation && faveLocationList.length > 0) {
      setIsFave(faveLocationList.some(location => location.id === selectedLocation.id));
    } else {
      setIsFave(false);
    }
  }, [selectedLocation, faveLocationList]);

  useEffect(() => {
    setTempLocationList(locationList.filter(location => String(location.id).startsWith('temp')));
  }, [locationList]);

  useEffect(() => {
    setSavedLocationList(locationList.filter(location => !(String(location.id).startsWith('temp'))));
  }, [locationList]);

  const updateAdditionalDetails = async (location) => {
    setLoadingAdditionalDetails(true);
    try {
      if (location && location.id) { 
        const details = await fetchLocationDetails({
          address: encodeURIComponent(`${location.title} ${location.address}`),
          lat: parseFloat(location.latitude),
          lon: parseFloat(location.longitude),
        });
        console.log('Fetched additional location details...');
        setAdditionalDetails(details);
      } else {
        console.log('No location provided. Resetting additional details.');
        setAdditionalDetails(null);
      }
      setLoadingAdditionalDetails(false);
    } catch (err) {
      console.error('Error fetching location details:', err);
      setAdditionalDetails(null);
      setLoadingAdditionalDetails(false);
    }
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
      setLocationList, 
      loadingSelectedLocation,
      loadingAdditionalDetails,
      isTemp, 
      isFave,
      updateAdditionalDetails, // Add this function to the context value
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
