import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useFriendList } from "./FriendListContext";
import { useUser } from "./UserContext";
import { fetchFriendDashboard } from "../calls/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  updateFriendFavesColorThemeSetting,
  resetFriendFavesColorThemeToDefault,
} from "../calls/api";

const SelectedFriendContext = createContext({});

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);

  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendProvider"
    );
  }
  return context;
};

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

  const favesData = useMemo(() => {
    if (!friendDashboardData) return null;
    return friendDashboardData[0]?.friend_faves?.locations || null;
  }, [friendDashboardData]);

  useEffect(() => {
    if (favesData) {
      setFriendFavesData(favesData);
    }
  }, [favesData]);

  useEffect(() => {
    if (isError) {
      deselectFriend();
    }
  }, [isError]);

  const updateFavesThemeMutation = useMutation({
    mutationFn: (data) => updateFriendFavesColorThemeSetting(data),

    // onError: (error) => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }

    //   timeoutRef.current = setTimeout(() => {
    //     createHelloMutation.reset();
    //   }, 2000);
    // },
    onSuccess: (data) => {
      // console.log(data);
      queryClient.setQueryData(
        ["friendDashboardData", user?.id, selectedFriend?.id],
        (oldData) => {
          if (!oldData || !oldData[0]) return oldData;

          return {
            ...oldData,
            0: {
              ...oldData[0],
              friend_faves: {
                ...oldData[0].friend_faves,
                use_friend_color_theme: data.use_friend_color_theme,
              },
            },
          };
        }
      );
      //   (old) => {
      //     const updatedHelloes = old ? [data, ...old] : [data];
      //     return updatedHelloes;
      //   }
      // );
      //refetchUpcomingHelleos();

      // const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
      //console.log("Actual HelloesList after mutation:", actualHelloesList);

      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }

      // timeoutRef.current = setTimeout(() => {
      //   createHelloMutation.reset();
      // }, 2000);
    },
  });

  const handleUpdateFavesTheme = ({savedDarkColor, savedLightColor, manualThemeOn}) => {
 
    const theme = {
      userId: user?.id,
      friendId: selectedFriend?.id,

      darkColor: savedDarkColor,
      lightColor: savedLightColor,
      manualTheme: manualThemeOn,
      //  use_friend_color_theme: true,
    };

    try {
      updateFavesThemeMutation.mutate(theme);
      // await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

  const loadingNewFriend = isLoading;
  const friendLoaded = isSuccess;
  const errorLoadingFriend = isError;

  const deselectFriend = () => {
    queryClient.resetQueries([
      "friendDashboardData",
      user?.id,
      selectedFriend?.id,
    ]);
    setSelectedFriend(null);
    resetTheme();
  };

  useEffect(() => {
    if (!selectedFriend) {
      deselectFriend();
    }
  }, [selectedFriend]);

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
        friendFavesData,
        setFriendFavesData,
        loadingNewFriend,
        handleUpdateFavesTheme,
      }}
    >
      {children}
    </SelectedFriendContext.Provider>
  );
};

//export default SelectedFriendContext;
