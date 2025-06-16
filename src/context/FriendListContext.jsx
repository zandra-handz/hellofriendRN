import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext'; // Import useAuthUser hook
import { fetchFriendList } from '../calls/api'; 
 import { useQuery } from "@tanstack/react-query";

const FriendListContext = createContext({
  friendList: [], 
  setFriendList: () => {}, 
  addToFriendList: () => {}, 
  removeFromFriendList: () => {}, 
  updateFriend: () => {}

});

export const useFriendList = () => useContext(FriendListContext);

export const FriendListProvider = ({ children }) => {
  const {  user, isAuthenticated, isInitializing } = useUser();   
  const [friendList, setFriendList] = useState(() => []); // lazy loading?
  const [ useGradientInSafeView, setUseGradientInSafeView] = useState(false);
   
  const [themeAheadOfLoading, setThemeAheadOfLoading] = useState({
    darkColor: '#4caf50',
    lightColor: '#a0f143',
    fontColor: '#000000', 
    fontColorSecondary: '#000000'


  });

  const updateSafeViewGradient = (boolean) => {
    setUseGradientInSafeView((prev) => boolean);
  }
  
  const getThemeAheadOfLoading = (loadingFriend) => {
     
    setThemeAheadOfLoading({lightColor: loadingFriend.lightColor || '#a0f143', darkColor: loadingFriend.darkColor || '#4caf50', fontColor: loadingFriend.fontColor || '#000000', fontColorSecondary: loadingFriend.fontColorSecondary || '#000000'});

  };

  const resetTheme = () => {
   
    setThemeAheadOfLoading({
      lightColor: '#a0f143', 
      darkColor: '#4caf50', 
      fontColor: '#000000', 
      fontColorSecondary: '#000000'}); 
  };
 


const {
  data: friendListData = [],
  isLoading,
  isFetching,
  isSuccess: friendListIsSuccess,
  isError,
} = useQuery({
  queryKey: ["friendList", user?.id],
  queryFn: async () => {
    const friendData = await fetchFriendList();
    return friendData.map((friend) => ({
      id: friend.id,
      name: friend.name,
      savedDarkColor: friend.saved_color_dark || "#4caf50",
      savedLightColor: friend.saved_color_light || "#a0f143",
      darkColor: friend.theme_color_dark || "#4caf50",
      lightColor: friend.theme_color_light || "#a0f143",
      fontColor: friend.theme_color_font || "#000000",
      fontColorSecondary: friend.theme_color_font_secondary || "#000000",
    }));
  },
  enabled: !!(isAuthenticated && !isInitializing),
  staleTime: 1000 * 60 * 60 * 10, // 10 hours
 
});

useEffect(() => {
  if (friendListIsSuccess && friendListData) {
    setFriendList(friendListData);
  }

}, [friendListIsSuccess] );

 

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
      try {
      const idsToRemove = Array.isArray(friendIdToRemove) ? friendIdToRemove : [friendIdToRemove];
      console.log('friend removed from friend list!');
      return prevFriendList.filter(friend => !idsToRemove.includes(friend.id));
      
      } catch (error) {
        console.log('error removing friend from list: ', error);
        
      }
    });
  };

  const friendListLength = friendList.length;

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
      return [...prevFriendList];  // new array to trigger rerender
    });
  };


  const updateFriendListColorsExcludeSaved = (friendId, darkColor, lightColor, fontColor, fontColorSecondary) => {
    setFriendList(prevFriendList => {
      const friend = prevFriendList.find(friend => friend.id === friendId);
      if (friend) {
        friend.darkColor = darkColor;
        //friend.savedDarkColor = darkColor;
        friend.lightColor = lightColor; 
        //friend.savedLightColor = lightColor;
        friend.fontColor = fontColor;
        friend.fontColorSecondary = fontColorSecondary;
        setThemeAheadOfLoading({lightColor: lightColor, darkColor: darkColor, fontColor: fontColor, fontColorSecondary: fontColorSecondary});
  
      }
      return [...prevFriendList];  // new array for rerender
    });
  };

  

  return (
    <FriendListContext.Provider value={{
      friendList,
      friendListLength,
      setFriendList,
      themeAheadOfLoading,
      setThemeAheadOfLoading,
      getThemeAheadOfLoading,
      resetTheme,
      addToFriendList,
      removeFromFriendList,
      updateFriend,
      updateFriendListColors,
      updateFriendListColorsExcludeSaved,

      useGradientInSafeView,
      setUseGradientInSafeView,
      updateSafeViewGradient,
    }}>
      {children}
    </FriendListContext.Provider>
  );
};
