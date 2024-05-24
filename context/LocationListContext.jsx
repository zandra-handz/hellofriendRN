import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllLocations } from '../api';

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationData = await fetchAllLocations();
        const extractedLocations = locationData.map(location => ({
          id: location.id,
          title: location.title,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          notes: location.personal_experience_info,
          friends: location.friends.map(friendId => ({ id: friendId })),
          validatedAddress: location.validated_address,
        }));
        setLocationList(extractedLocations);
        console.log('Fetch (location) Data:', extractedLocations);
      } catch (error) {
        console.error('Error fetching location list:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <LocationListContext.Provider value={{ locationList, setLocationList }}>
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
