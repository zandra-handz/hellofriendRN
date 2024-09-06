import React, { createContext, useState, useContext, useEffect } from 'react';
import { useFriendList } from './FriendListContext';
import { useAuthUser } from './AuthUserContext';  
import { fetchFriendDashboard } from '../api'; 

const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { authUserState } = useAuthUser(); 
  const { friendList } = useFriendList(); 
  const [friendDashboardData, setFriendDashboardData] = useState(null);
  const [friendColorTheme, setFriendColorTheme] = useState({
    useFriendColorTheme: null,
    invertGradient: null,
    lightColor: null,
    darkColor: null,
  });
  const [calculatedThemeColors, setCalculatedThemeColors] = useState({
    lightColor: 'white',
    darkColor: 'gray',
  });
  const [loadingNewFriend, setLoadingNewFriend] = useState(false);

  useEffect(() => {
    console.log('Friend list:', friendList); 
  }, [friendList]);

  useEffect(() => {
    const fetchFriendDashboardData = async (friendId) => {
      setLoadingNewFriend(true);
      try {
        const dashboardData = await fetchFriendDashboard(friendId);
        console.log('Friend dashboard data:', dashboardData);
        setFriendDashboardData(dashboardData);

        const data = Array.isArray(dashboardData) ? dashboardData[0] : dashboardData;

        const colorThemeData = {
          useFriendColorTheme: data.friend_faves.use_friend_color_theme || null,
          invertGradient: data?.friend_faves?.second_color_option || false,
          lightColor: data?.friend_faves?.light_color || null,
          darkColor: data?.friend_faves?.dark_color || null,
        };
        console.log('Setting color theme data:', colorThemeData); // Add this line
        setFriendColorTheme(colorThemeData);

      } catch (error) {
        console.error('Error fetching friend dashboard data:', error);
      } finally {
        setLoadingNewFriend(false);
      }
    };

    if (selectedFriend) {
      fetchFriendDashboardData(selectedFriend.id);
    } else {
      setFriendDashboardData(null);
    }
  }, [selectedFriend]);


  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if(friendColorTheme.invertGradient) {
        setCalculatedThemeColors({
          lightColor: friendColorTheme.darkColor || '#a0f143',
          darkColor: friendColorTheme.lightColor || '#4caf50',
        });
      } else {
        setCalculatedThemeColors({
          lightColor: friendColorTheme.lightColor || '#a0f143',
          darkColor: friendColorTheme.darkColor || '#4caf50',
        });
      }
    } else {
      setCalculatedThemeColors({
        lightColor: '#a0f143',
        darkColor: '#4caf50',
      });
    }
  }, [friendColorTheme]);

  useEffect(() => {
    setSelectedFriend(null);
  }, [authUserState]);

  useEffect(() => {
    console.log('Selected friend being set:', selectedFriend);
  }, [selectedFriend]);

  useEffect(() => {
    console.log('Friend color theme updated:', friendColorTheme); // Add this line
  }, [friendColorTheme]);

  const updateFriendDashboardData = (newData) => {
    setFriendDashboardData(newData);

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
