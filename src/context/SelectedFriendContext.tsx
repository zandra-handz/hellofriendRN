import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useFriendList } from "./FriendListContext";
import { useUser } from "./UserContext";
import { fetchFriendDashboard } from "../calls/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { user, isAuthenticated } = useUser();
  const { friendList, resetTheme } = useFriendList();
  const [friendFavesData, setFriendFavesData] = useState(null);

  const [friendColorTheme, setFriendColorTheme] = useState({
    useFriendColorTheme: null,
    invertGradient: null,
    lightColor: null,
    darkColor: null,
  });

  const queryClient = useQueryClient();
 

  const {
    data: friendDashboardData,
    isLoading,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["friendDashboardData", user?.id, selectedFriend?.id],
    queryFn: () => fetchFriendDashboard(selectedFriend.id),
    enabled: !!(isAuthenticated && selectedFriend && selectedFriend?.id),
    staleTime: 1000 * 60 * 20, // 20 minutes
     
  });
 
const colorThemeData = useMemo(() => {
  if (!friendDashboardData || !isSuccess) return null;
  const lowerLayerData = Array.isArray(friendDashboardData)
    ? friendDashboardData[0]
    : friendDashboardData;

  return {
    useFriendColorTheme: lowerLayerData?.friend_faves?.use_friend_color_theme || false,
    invertGradient: lowerLayerData?.friend_faves?.second_color_option || false,
    lightColor: lowerLayerData?.friend_faves?.light_color || null,
    darkColor: lowerLayerData?.friend_faves?.dark_color || null,
  };
}, [friendDashboardData, isSuccess]);

const favesData = useMemo(() => {
  if (!friendDashboardData) return null;
  return friendDashboardData[0]?.friend_faves?.locations || null;
 
}, [friendDashboardData ]);

useEffect(() => {
  if (colorThemeData ) {
   setFriendColorTheme(colorThemeData); 
  }
}, [colorThemeData ]);

useEffect(() => {
  if ( favesData) {
  setFriendFavesData(favesData);
  }
}, [ favesData]);
 

  useEffect(() => {
    if (isError) {
      deselectFriend();
    }
  }, [isError]);

  const loadingNewFriend = isLoading;
  const friendLoaded = isSuccess;
  const errorLoadingFriend = isError;

 

  const deselectFriend = () => { 

    queryClient.resetQueries(["friendDashboardData", user?.id, selectedFriend?.id]);
        setSelectedFriend(null);
    resetTheme();
    setFriendColorTheme({
      useFriendColorTheme: null,
      invertGradient: null,
      lightColor: null,
      darkColor: null,
    });
  };
 

  useEffect(() => {
    if (!selectedFriend) {
      deselectFriend();
    }
  }, [selectedFriend]);

 

  const updateFriendColorTheme = (newColorTheme) => {
    setFriendColorTheme((prev) => ({
      ...prev,
      ...newColorTheme,
    }));
  };

  return (
    <SelectedFriendContext.Provider
      value={{
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
        friendColorTheme,
        setFriendColorTheme,
        friendFavesData, 
        setFriendFavesData,
        loadingNewFriend, 
        updateFriendColorTheme, 
      //  getFaveLocationIds,
      }}
    >
      {children}
    </SelectedFriendContext.Provider>
  );
};

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);

  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendProvider"
    );
  }

  return context;
};

export default SelectedFriendContext;
