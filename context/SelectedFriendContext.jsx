import React, { createContext, useState, useContext, useEffect } from 'react';
import { useFriendList } from './FriendListContext';
import { useAuthUser } from './AuthUserContext';  
import { fetchFriendDashboard } from '../api';  
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { authUserState } = useAuthUser(); 
  const { friendList, resetTheme } = useFriendList();  
  const [friendFavesData, setFriendFavesData ] = useState({
    friendFaveLocations: null,
  })

  const [friendColorTheme, setFriendColorTheme] = useState({
    useFriendColorTheme: null,
    invertGradient: null,
    lightColor: null,
    darkColor: null,
  });
 
  const queryClient = useQueryClient();


  const [favoriteLocationIds, setFavoriteLocationIds] = useState([]);
    
  const { data: friendDashboardData, isLoading, isPending, isError, isSuccess } = useQuery({
    queryKey: ['friendDashboardData', selectedFriend?.id],
    queryFn: () => fetchFriendDashboard(selectedFriend.id),
    enabled: !!selectedFriend && !!selectedFriend.id,  
    onError: (err) => {
      console.error('Error fetching friend data:', err);
      
    },
    onSuccess: (data) => {
      //console.log('Raw data in RQ onSuccess:', data);
  
      // // Debugging: Log query key and cached data
      // const queryKey = ['friendDashboardData', selectedFriend?.id];
      // console.log('Query Key:', queryKey);
      // const cachedData = queryClient.getQueryData(queryKey);
      // console.log('Cached friendDashboardData onSuccess:', cachedData);
    },
  });


  // useEffect(() => {
  //   if (friendDashboardData) {
  //     console.log('friendDashboardData updated:', friendDashboardData);
  
  //     const queryKey = ['friendDashboardData', selectedFriend.id];
  //     const cachedData = queryClient.getQueryData(queryKey);
  
  //     console.log('Query Key:', queryKey);
  //     console.log('Cached friendDashboardData in useEffect:', cachedData);
  
  //     if (!cachedData) {
  //       console.warn('Cache is undefined. Verify query key and timing.');
  //     }
  //   }
  // }, [friendDashboardData, queryClient, selectedFriend]);


  const getFaveLocationIds = () => {
    if (!selectedFriend || !selectedFriend.id) {
      console.warn('No selected friend or friend ID found');
      return []; 
    }
    
    const cachedData = queryClient.getQueryData(['friendDashboardData', selectedFriend.id]);
    
    if (cachedData && cachedData[0] && cachedData[0].friend_faves) {
      return cachedData[0].friend_faves.locations || [];
    }
    
    console.warn('No cached data found for selected friend');
    return [];   
  };



  useEffect(() => {
    if (isError) {

      deselectFriend();
    }
  }, [isError]);

  const loadingNewFriend = isLoading;
  const friendLoaded = isSuccess;
  const errorLoadingFriend = isError;
 

  useEffect(() => {
    if (friendDashboardData) {

      // console.log(
      //   'Specific Cache:',
      //   queryClient.getQueryData(['friendDashboardData', selectedFriend.id])
      // );

      const cachedData = queryClient.getQueryData(['friendDashboardData', selectedFriend.id]);

const cachedDataLower = cachedData[0].friend_faves?.locations || null;
      const lowerLayerData = Array.isArray(friendDashboardData) ? friendDashboardData[0] : friendDashboardData;
     
      //const lowerLayerData = Array.isArray(friendDashboardData) ? friendDashboardData[0] : friendDashboardData;
     
      const colorThemeData = {
        useFriendColorTheme: lowerLayerData?.friend_faves?.use_friend_color_theme || false,
        invertGradient: lowerLayerData?.friend_faves?.second_color_option || false,
        lightColor: lowerLayerData?.friend_faves?.light_color || null,
        darkColor: lowerLayerData?.friend_faves?.dark_color || null,
      };
      const friendFavesData = {
        friendFaveLocations: cachedDataLower || null,
      };
      console.log('Setting color theme data in useEffect:', colorThemeData);
      setFriendFavesData(friendFavesData);
      console.log('Setting color theme data in useEffect:', friendFavesData);
      setFriendColorTheme(colorThemeData);
    }
  }, [friendDashboardData]); 



  
  

  const deselectFriend = () => {
    console.log('friend deselected via deselectFriend()');
    setSelectedFriend(null);
    resetTheme();
    queryClient.resetQueries(['friendDashboardData']);
    setFriendColorTheme({
      useFriendColorTheme: null,
      invertGradient: null,
      lightColor: null,
      darkColor: null,
  });
  
  };


  //HMM WHAT IS THIS
  useEffect(() => {
    
    console.log('friend getting deselected when no authuserstate');
    deselectFriend();
  }, [authUserState]);

  useEffect(() => {
    if (!selectedFriend) {
      deselectFriend();
    
    }
  }, [selectedFriend]);
  
 

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
      deselectFriend,
      friendLoaded,
      errorLoadingFriend,
      friendList,
      isPending,
      isLoading,
      isSuccess,
      friendDashboardData, 
      favoriteLocationIds,
      friendColorTheme,
      setFriendColorTheme,
      friendFavesData, 
      //calculatedThemeColors,
      loadingNewFriend,
      updateFriendDashboardData,
      updateFriendColorTheme,
      favoriteLocationIds,
      getFaveLocationIds,
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
