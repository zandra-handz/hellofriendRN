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
  const { authUserState } = useAuthUser();  
  const [friendList, setFriendList] = useState([]);
  const [themeAheadOfLoading, setThemeAheadOfLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authUserState.authenticated) { 
          const friendData = await fetchFriendList(); 
          const friendList = friendData.map(friend => ({ id: friend.id, name: friend.name, darkColor: friend.theme_color_dark, lightColor: friend.theme_color_light}));
          
          setFriendList(friendList);
        }
      } catch (error) {
        console.error('Error fetching friend list:', error);
      }
    };

    fetchData();
  }, [authUserState.authenticated]);  


  const getThemeAheadOfLoading = (loadingFriend) => {
    
    setThemeAheadOfLoading({lightColor: loadingFriend.lightColor, darkColor: loadingFriend.darkColor});
  };


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

  const updateFriendListColors = (friendId, darkColor, lightColor) => {
    setFriendList(prevFriendList => {
      prevFriendList.forEach(friend => {
        if (friend.id === friendId) {
          // Directly update the colors in the original list
          friend.darkColor = darkColor;  // Set darkColor, even if null
          friend.lightColor = lightColor;  // Set lightColor, even if null
        }
      });
      return prevFriendList;  // No need to create a new array
    });
  };
  return (
    <FriendListContext.Provider value={{
      friendList,
      setFriendList,
      themeAheadOfLoading,
      setThemeAheadOfLoading,
      getThemeAheadOfLoading,
      addToFriendList,
      removeFromFriendList,
      updateFriend,
      updateFriendListColors
    }}>
      {children}
    </FriendListContext.Provider>
  );
};
