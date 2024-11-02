import React, { createContext, useState, useContext, useEffect } from 'react';
import { useFriendList } from './FriendListContext';
import { useAuthUser } from './AuthUserContext';  
import { fetchFriendDashboard } from '../api'; 
import tinycolor from 'tinycolor2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendDataFetched, setFriendDataFetched ] = useState(false);
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




  const { data: friendDashboardData, isLoading, isError, isSuccess } = useQuery({
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


  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;  
   
    if (!tinycolor.isReadable(baseColor, targetColor, { level: 'AA', size: 'small' })) {
       fontColor = isInverted ? 'white' : 'black';
  
      if (!tinycolor.isReadable(baseColor, fontColor, { level: 'AA', size: 'small' })) {
        // If not readable, switch to the opposite color
        fontColor = fontColor === 'white' ? 'black' : 'white';
      }
    }
  
    return fontColor; // Return the determined font color
  };

  const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor; // Start with the base color
  
    // Check if the targetColor is readable on the baseColor
    if (!tinycolor.isReadable(targetColor, baseColor, { level: 'AA', size: 'small' })) {
      // If not readable, switch to black or white based on isInverted
      fontColorSecondary = isInverted ? 'black' : 'white';
  
      if (!tinycolor.isReadable(targetColor, fontColorSecondary, { level: 'AA', size: 'small' })) {
        // If not readable, switch to the opposite color
        fontColorSecondary = fontColorSecondary === 'black' ? 'white' : 'black';
      }
    }
  
    return fontColorSecondary; // Return the determined secondary font color
  };
  
  


  useEffect(() => {
    console.log('FRIEND COLOR THEME CALCULATIONS TRIGGERED');
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) { 

      if (friendColorTheme.invertGradient) {
        setCalculatedThemeColors({
          lightColor: friendColorTheme.darkColor || '#a0f143',
          darkColor: friendColorTheme.lightColor || '#4caf50',
          fontColor: getFontColor(
            friendColorTheme.lightColor || '#a0f143', // baseColor
            friendColorTheme.darkColor || '#4caf50', // targetColor
            true // isInverted
          ),
          fontColorSecondary: getFontColorSecondary(
            friendColorTheme.lightColor || '#a0f143', // baseColor
            friendColorTheme.darkColor || '#4caf50', // targetColor
            true // isInverted
          ),
        });
      } else {
        setCalculatedThemeColors({
          lightColor: friendColorTheme.lightColor || '#a0f143',
          darkColor: friendColorTheme.darkColor || '#4caf50',
          fontColor: getFontColor(
            friendColorTheme.darkColor || '#a0f143', // baseColor
            friendColorTheme.lightColor || '#4caf50', // targetColor
            false // isInverted
          ),
          fontColorSecondary: getFontColorSecondary(
            friendColorTheme.darkColor || '#a0f143', // baseColor
            friendColorTheme.lightColor || '#4caf50', // targetColor
            false // isInverted
          ),
        });
      }
    } else {
      setCalculatedThemeColors({
        lightColor: '#a0f143',
        darkColor: '#4caf50',
        fontColor: 'black',
        fontColorSecondary: 'black',
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
