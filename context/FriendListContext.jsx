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
  const [themeAheadOfLoading, setThemeAheadOfLoading] = useState({
    darkColor: '#4caf50',
    lightColor: '#a0f143',
    fontColor: 'black', 
    fontColorSecondary: 'black'


  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authUserState.authenticated) { 
          const friendData = await fetchFriendList(); 
          const friendList = friendData.map(friend => ({ 
            id: friend.id, 
            name: friend.name, 
            savedDarkColor: friend.saved_color_dark,
            savedLightColor: friend.saved_color_light,
            darkColor: friend.theme_color_dark, 
            lightColor: friend.theme_color_light,
            fontColor: friend.theme_color_font,
            fontColorSecondary: friend.theme_color_font_secondary,
          }));
          
          setFriendList(friendList);
        }
      } catch (error) {
        console.error('Error fetching friend list:', error);
      }
    };

    fetchData();
  }, [authUserState.authenticated]);  


  const getThemeAheadOfLoading = (loadingFriend) => {
    
    setThemeAheadOfLoading({lightColor: loadingFriend.lightColor, darkColor: loadingFriend.darkColor, fontColor: loadingFriend.fontColor, fontColorSecondary: loadingFriend.fontColorSecondary});
  
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

  const updateFriendListColors = (friendId, darkColor, lightColor, fontColor, fontColorSecondary) => {
    setFriendList(prevFriendList => {
      const friend = prevFriendList.find(friend => friend.id === friendId);
      if (friend) {
        friend.darkColor = darkColor;
        friend.savedDarkColor = darkColor;
        friend.lightColor = lightColor; 
        friend.savedLightColor = lightColor;
        friend.fontColor = fontColor;
        friend.fontColorSecondary = fontColorSecondary;
        setThemeAheadOfLoading({lightColor: lightColor, darkColor: darkColor, fontColor: fontColor, fontColorSecondary: fontColorSecondary});
  
      }
      return [...prevFriendList];  // Create a new array to trigger re-render
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
