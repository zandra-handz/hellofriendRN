import React, { createContext, useState, useContext, useEffect } from "react";
import { useFriendList } from "./FriendListContext";
import { useUser } from "./UserContext";
import { fetchFriendDashboard } from "../calls/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SelectedFriendContext = createContext({});

export const SelectedFriendProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { user } = useUser();
  const { friendList, resetTheme } = useFriendList();
  const [friendFavesData, setFriendFavesData] = useState({
    friendFaveLocations: null,
  });

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
    queryKey: ["friendDashboardData", user?.user?.id, selectedFriend?.id],
    queryFn: () => fetchFriendDashboard(selectedFriend.id),
    enabled: !!(selectedFriend && selectedFriend?.id && user?.user?.id),
    staleTime: 1000 * 60 * 10, // 10 minutes

    onError: (err) => {
      console.error("Error fetching friend data:", err);
    },
  });

  const getFaveLocationIds = () => {
    if (!selectedFriend || !selectedFriend.id) {
      console.warn("No selected friend or friend ID found");
      return [];
    }

    const cachedData = queryClient.getQueryData([
      "friendDashboardData",
      user?.user?.id,
      selectedFriend.id,
    ]);

    if (cachedData && cachedData[0] && cachedData[0].friend_faves) {
      return cachedData[0].friend_faves.locations || [];
    }

    console.warn("No cached data found for selected friend");
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
 
      const cachedData = queryClient.getQueryData([
        "friendDashboardData",
        user?.user?.id,
        selectedFriend.id,
      ]);

      const cachedDataLower = cachedData[0].friend_faves?.locations || null;
      const lowerLayerData = Array.isArray(friendDashboardData)
        ? friendDashboardData[0]
        : friendDashboardData;
 
      const colorThemeData = {
        useFriendColorTheme:
          lowerLayerData?.friend_faves?.use_friend_color_theme || false,
        invertGradient:
          lowerLayerData?.friend_faves?.second_color_option || false,
        lightColor: lowerLayerData?.friend_faves?.light_color || null,
        darkColor: lowerLayerData?.friend_faves?.dark_color || null,
      };
      const friendFavesData = {
        friendFaveLocations: cachedDataLower || null,
      };
      console.log("Setting color theme data in useEffect:", colorThemeData);
      setFriendFavesData(friendFavesData);
      console.log("Setting color theme data in useEffect:", friendFavesData);
      setFriendColorTheme(colorThemeData);
    }
  }, [friendDashboardData]);

  const deselectFriend = () => { 
    setSelectedFriend(null);
    resetTheme();
    queryClient.resetQueries(["friendDashboardData"]);
    setFriendColorTheme({
      useFriendColorTheme: null,
      invertGradient: null,
      lightColor: null,
      darkColor: null,
    });
  };

  //HMM WHAT IS THIS
  // useEffect(() => { 
  //   deselectFriend();
  // }, [user]);

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
        loadingNewFriend, 
        updateFriendColorTheme, 
        getFaveLocationIds,
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
