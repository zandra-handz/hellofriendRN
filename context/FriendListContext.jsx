import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext'; // Import useAuthUser hook

import { fetchFriendList } from '../api';

const FriendListContext = createContext({
  friendList: [], 
  setFriendList: () => {}, 
  addToFriendList: () => {}, 
  removeFromFriendList: () => {}, 
  updateFriend: () => {}

});

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
  }, [authUserState.authenticated]);  


  const addToFriendList = (newFriend) => {
    setFriendList(prevFriendList => { 
      const isAlreadyFriend = prevFriendList.some(friend => friend.id === newFriend.id);
      if (!isAlreadyFriend) {
        return [...prevFriendList, newFriend];
      }
      return prevFriendList;
    });
  };

  const removeFromFriendList = (friendIdToRemove) => {
    setFriendList(prevFriendList => {
      const idsToRemove = Array.isArray(friendIdToRemove) ? friendIdToRemove : [friendIdToRemove];

      return prevFriendList.filter(friend => !idsToRemove.includes(friend.id));
    });
  };


  const updateFriend = (updatedFriend) => {
    setFriendList(prevFriendList => {
      return prevFriendList.map(friend =>
        friend.id === updatedFriend.id ? updatedFriend : friend
      );
    });
  }; 

  return (
    <FriendListContext.Provider value={{
      friendList,
      setFriendList,
      addToFriendList,
      removeFromFriendList,
      updateFriend
    }}>
      {children}
    </FriendListContext.Provider>
  );
};
