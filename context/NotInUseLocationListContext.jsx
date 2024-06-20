import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext';
import { fetchAllLocations } from '../api';
import { useFriendList } from './FriendListContext'; // Import useFriendList hook

const LocationListContext = createContext();

export const LocationListProvider = ({ children }) => {
  const [locationList, setLocationList] = useState([]);
  const [validatedLocationList, setValidatedLocationList] = useState([]);
  const { authUserState } = useAuthUser();
  const { friendList } = useFriendList(); // Use friendList from FriendListContext

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationData = await fetchAllLocations();

        // Enhance locationData with friend names
        const enrichedLocationData = locationData.map(location => ({
          ...location,
          friends: location.friends.map(friendId => {
            const friend = friendList.find(friend => friend.id === friendId);
            return friend ? { id: friend.id, name: friend.name } : { id: friendId, name: 'Unknown Friend' }; // Enhance friend object with name
          })
        }));

        setLocationList(enrichedLocationData);
        console.log('Fetch (location) Data:', enrichedLocationData);
      } catch (error) {
        console.error('Error fetching location list:', error);
      }
    };

    if (authUserState.authenticated) {
      fetchData();
    } else {
      setLocationList([]);
    }
  }, [authUserState.authenticated, friendList]);

  useEffect(() => {
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
