import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { fetchAllLocations } from '../api';

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);
  const [faveLocationList, setFaveLocationList] = useState([]);
  const [validatedLocationList, setValidatedLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isTemp, setIsTemp] = useState(false); // Add isTemp state
  const [isFave, setIsFave] = useState(false); // Add isFave state
  const { authUserState } = useAuthUser(); // Use the authentication state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationData = await fetchAllLocations();
        setLocationList(locationData);
        console.log('Fetch (location) Data:', locationData);

        // Set the initial selected location
        if (locationData.length > 0) {
          setSelectedLocation(locationData[locationData.length - 1]);
        }

      } catch (error) {
        console.error('Error fetching location list:', error);
      }
    };

    if (authUserState.authenticated) {
      fetchData();
    } else {
      setLocationList([]);
    }
  }, [authUserState.authenticated]); // Fetch data when authenticated

  useEffect(() => {
    setValidatedLocationList(locationList.filter(location => location.validatedAddress));
  }, [locationList]);

  useEffect(() => {
    if (selectedLocation && selectedLocation.id) {
      setIsTemp(String(selectedLocation.id).startsWith('temp'));
    } else {
      setIsTemp(false); // Default to false if selectedLocation is null or id is missing
    }
  }, [selectedLocation]); // Dependency on selectedLocation
  
  useEffect(() => {
    if (selectedLocation && faveLocationList.length > 0) {
      setIsFave(faveLocationList.some(location => location.id === selectedLocation.id));
    } else {
      setIsFave(false); // Default to false if no selectedLocation or empty faveLocationList
    }
  }, [selectedLocation, faveLocationList]); // Update isFave when selectedLocation or faveLocationList changes

  const populateFaveLocationsList = (locationIds) => {
    const favoriteLocations = locationList.filter(location => locationIds.includes(location.id));
    setFaveLocationList(favoriteLocations);
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
      selectedLocation, 
      setSelectedLocation, 
      populateFaveLocationsList, 
      addLocationToFaves, 
      removeLocationFromFaves, 
      setLocationList, 
      isTemp, // Provide isTemp directly
      isFave // Provide isFave directly
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
