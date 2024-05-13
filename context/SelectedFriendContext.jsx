import React, { createContext, useState, useContext, useEffect } from 'react';
import { useFriendList } from './FriendListContext';
import { useAuthUser } from './AuthUserContext';  
import { fetchFriendDashboard } from '../api'; 

const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { authUserState } = useAuthUser(); // Get authentication state
  const { friendList } = useFriendList(); // Get friend list from FriendListContext
  const [friendDashboardData, setFriendDashboardData] = useState(null);
  const [loadingNewFriend, setLoadingNewFriend] = useState(false);

  useEffect(() => {
    console.log('Friend list:', friendList);
    // This will log the friend list obtained from the FriendListContext
  }, [friendList]);

  useEffect(() => {
    const fetchFriendDashboardData = async (friendId) => {
      setLoadingNewFriend(true);
      try {
        const dashboardData = await fetchFriendDashboard(friendId);
        console.log('Friend dashboard data:', dashboardData);
        setFriendDashboardData(dashboardData);
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
    // Reset selectedFriend to null when the authUserState changes (user logs in or logs out)
    setSelectedFriend(null);
  }, [authUserState]);

  useEffect(() => {
    console.log('Selected friend being set:', selectedFriend);
  }, [selectedFriend]);

  const updateFriendDashboardData = (friendId, newData) => {
    setFriendDashboardData(newData);
    // You might need to call an API here to update the dashboard data on the server
  };

  return (
    <SelectedFriendContext.Provider value={{ 
      selectedFriend, 
      setFriend: setSelectedFriend, 
      friendList, 
      friendDashboardData, 
      loadingNewFriend,
      updateFriendDashboardData, // Include the updateFriendDashboardData function in the context value
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
