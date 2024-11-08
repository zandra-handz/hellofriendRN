import React, { createContext, useState, useContext, useEffect } from 'react';
import { useFriendList } from './FriendListContext';
import { useAuthUser } from './AuthUserContext';  
import { fetchFriendDashboard } from '../api';  
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { authUserState } = useAuthUser(); 
  const { friendList } = useFriendList();  const [friendColorTheme, setFriendColorTheme] = useState({
    useFriendColorTheme: null,
    invertGradient: null,
    lightColor: null,
    darkColor: null,
  });
  const [calculatedThemeColors, setCalculatedThemeColors] = useState({
    lightColor: '#a0f143',
    darkColor: '#4caf50',
  }); 
  const queryClient = useQueryClient();




  const { data: friendDashboardData, isLoading, isPending, isError, isSuccess } = useQuery({
    queryKey: ['friendDashboardData', selectedFriend?.id],
    queryFn: () => fetchFriendDashboard(selectedFriend.id),
    enabled: !!selectedFriend,
    onError: (err) => {
      console.error('Error fetching friend data:', err);
      
    },
    onSuccess: (data) => {
      console.log('Raw data in RQ onSuccess:', data);
      if (!data) {
          console.log('No data received');
          return;
      }
    }
  });




  useEffect(() => {
    if (isError) {
      setSelectedFriend(null);
    }
  }, [isError]);

  const loadingNewFriend = isLoading;
  const friendLoaded = isSuccess;
 

  useEffect(() => {
    if (friendDashboardData) {
      const lowerLayerData = Array.isArray(friendDashboardData) ? friendDashboardData[0] : friendDashboardData;
      const colorThemeData = {
        useFriendColorTheme: lowerLayerData?.friend_faves?.use_friend_color_theme || false,
        invertGradient: lowerLayerData?.friend_faves?.second_color_option || false,
        lightColor: lowerLayerData?.friend_faves?.light_color || null,
        darkColor: lowerLayerData?.friend_faves?.dark_color || null,
      };
      console.log('Setting color theme data in useEffect:', colorThemeData);
      setFriendColorTheme(colorThemeData);
    }
  }, [friendDashboardData]); // Depend on `friendDashboardData`
  
 

  useEffect(() => {
    if (!selectedFriend) { 
        setFriendColorTheme({
            useFriendColorTheme: null,
            invertGradient: null,
            lightColor: null,
            darkColor: null,
        });
    }
}, [selectedFriend]);


 
 
  

//placeholder until i replace them all with themeAheadOfLoading
  useEffect(() => {
    console.log('FRIEND COLOR THEME CALCULATIONS TRIGGERED');
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) { 
 
        setCalculatedThemeColors({
          lightColor:   '#a0f143',
          darkColor:   '#4caf50',
          fontColor:  '#a0f143',  
          fontColorSecondary:   '#a0f143',
        });
      } 
  }, [friendColorTheme]);

  useEffect(() => {
    setSelectedFriend(null);
  }, [authUserState]);
 

  const updateFriendDashboardData = (newData) => {
    console.log('update');
    //setFriendDashboardData(newData);

  };

  const updateFriendColorTheme = (newColorTheme) => {
    setFriendColorTheme(prev => ({
      ...prev,
      ...newColorTheme
    }));
  };


  return (
    <SelectedFriendContext.Provider value={{ 
      selectedFriend, 
      setFriend: setSelectedFriend, 
      friendLoaded,
      friendList,
      isPending,
      isLoading,
      isSuccess,
      friendDashboardData, 
      friendColorTheme,
      setFriendColorTheme,
      calculatedThemeColors,
      loadingNewFriend,
      updateFriendDashboardData,
      updateFriendColorTheme,
    }}>
      {children}
    </SelectedFriendContext.Provider>
  );
};

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);

  if (!context) {
    throw new Error('useSelectedFriend must be used within a SelectedFriendProvider');
  }

  return context;
};

export default SelectedFriendContext;
