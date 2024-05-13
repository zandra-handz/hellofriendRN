import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import useAuthUser hook

import { fetchFriendList } from '../api';

const FriendListContext = createContext({});

export const useFriendList = () => useContext(FriendListContext);

export const FriendListProvider = ({ children }) => {
  const { authUserState } = useAuthUser(); // Get authentication state

  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authUserState.authenticated) {
          // Fetch friend list data only if user is authenticated
          const friendData = await fetchFriendList();
          // Extract and set the friend list
          const friendList = friendData.map(friend => ({ id: friend.id, name: friend.name }));
          setFriendList(friendList);
        }
      } catch (error) {
        console.error('Error fetching friend list:', error);
      }
    };

    fetchData();
  }, [authUserState.authenticated]); // Fetch data when authentication state changes

  const value = {
    friendList,
    setFriendList
  };

  return (
    <FriendListContext.Provider value={value}>
      {children}
    </FriendListContext.Provider>
  );
};
