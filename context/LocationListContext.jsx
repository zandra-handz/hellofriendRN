import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { fetchAllLocations } from '../api';

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);
  const [validatedLocationList, setValidatedLocationList] = useState([]);
  const { authUserState } = useAuthUser(); // Use the authentication state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationData = await fetchAllLocations();
        setLocationList(locationData);
        console.log('Fetch (location) Data:', locationData);
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
    // Update the filtered list whenever the locationList changes
    setValidatedLocationList(locationList.filter(location => location.validatedAddress));
  }, [locationList]);

  return (
    <LocationListContext.Provider value={{ locationList, validatedLocationList, setLocationList }}>
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
