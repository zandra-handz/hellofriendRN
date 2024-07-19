import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import the AuthUser context
import { selectedFriend } from './SelectedFriendContext';
import { fetchAllLocations } from '../api';

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);
  const [faveLocationList, setFaveLocationList] = useState([]);
  const [validatedLocationList, setValidatedLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { authUserState } = useAuthUser(); // Use the authentication state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationData = await fetchAllLocations();
        setLocationList(locationData);
        console.log('Fetch (location) Data:', locationData);
  
        // Logging friends object
        locationData.forEach(location => {
          console.log(`Friends for location ${location.title}:`, location.friends);
        });

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
    <LocationListContext.Provider value={{ locationList, validatedLocationList, faveLocationList, selectedLocation, setSelectedLocation, populateFaveLocationsList, addLocationToFaves, removeLocationFromFaves, setLocationList }}>
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
