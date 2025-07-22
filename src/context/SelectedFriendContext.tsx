import React, { createContext, useState, useContext, useMemo } from "react";
import { useUser } from "./UserContext";
import { fetchFriendDashboard } from "../calls/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Friend, FriendDashboardData } from "../types/FriendTypes";
import {
  updateFriendFavesColorThemeSetting,
  resetFriendFavesColorThemeToDefault,
} from "../calls/api";

interface ColorThemeUpdateProps {
  savedDarkColor: string;
  savedLightColor: string;
  manualThemeOn: boolean;
}

interface ColorThemeUpdateLoad {
  userId: number;
  friendId: number;

  darkColor: string;
  lightColor: string;
  manualTheme: boolean;
}

interface SelectedFriendType {
  selectedFriend: Friend | null;
  setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
  loadingNewFriend: boolean;
  friendDashboardData?: FriendDashboardData;
  selectFriend: (friend: Friend | null) => void; //setting as null will deselect, hence why it's allowed (was already an established approach)
}

const SelectedFriendContext = createContext<SelectedFriendType | undefined>(
  undefined
);

export const useSelectedFriend = () => {
  const context = useContext(SelectedFriendContext);

  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendProvider"
    );
  }
  return context;
};

console.warn("selected friend context rerendered");

interface SelectedFriendProviderProps {
  children: React.ReactNode;
}

export const SelectedFriendProvider: React.FC<SelectedFriendProviderProps> = ({
  children,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { user } = useUser();

  const queryClient = useQueryClient();

  const {
    data: friendDashboardData,
    isLoading,
    isPending,
    isError,
    isSuccess,
  } = useQuery<FriendDashboardData>({
    queryKey: ["friendDashboardData", user?.id, selectedFriend?.id],
    queryFn: () => fetchFriendDashboard(selectedFriend?.id),

    enabled: !!(user && selectedFriend),
    staleTime: 1000 * 60 * 20,
  });

  const updateFavesThemeMutation = useMutation({
    mutationFn: (data: ColorThemeUpdateLoad) =>
      updateFriendFavesColorThemeSetting(data),

    // onError: (error) => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }

    //   timeoutRef.current = setTimeout(() => {
    //     createHelloMutation.reset();
    //   }, 2000);
    // },
onSuccess: (data) => {
  queryClient.setQueryData<FriendDashboardData>(
    ["friendDashboardData", user?.id, selectedFriend?.id],
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        friend_faves: {
          ...oldData.friend_faves,
          use_friend_color_theme: data.use_friend_color_theme,
        },
      };
    }
  );
},
  });

  const handleUpdateFavesTheme = ({
    savedDarkColor,
    savedLightColor,
    manualThemeOn,
  }: ColorThemeUpdateProps) => {
    // console.warn("handle update faves theme");

    if (!user || !selectedFriend) {
      return;
    }

    const theme: ColorThemeUpdateLoad = {
      userId: user.id,
      friendId: selectedFriend.id,
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

  const selectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const deselectFriend = () => {
    setSelectedFriend(null);
    // resetTheme();  REMOVED IN ORDER TO REMOVE FRIEND LIST FROM THIS PROVIDER SO THAT THAT DOESN'T WATERFALL. MUST RESET THEME IN COMPONENTS
    // (example: HelloFriendFooter)
  };

  const contextValue = useMemo(
    () => ({
      selectedFriend,
      setFriend: setSelectedFriend,
      selectFriend,
      deselectFriend,
      friendLoaded: isSuccess,
      errorLoadingFriend: isError,
      loadingNewFriend: isLoading,
      isPending,
      isLoading,
      isSuccess,
      friendDashboardData,
      handleUpdateFavesTheme,
    }),
    [
      selectedFriend,
      setSelectedFriend,
      selectFriend,
      deselectFriend,
      isSuccess,
      isError,
      isLoading,
      isPending,
      isLoading,
      isSuccess,
      friendDashboardData,
      handleUpdateFavesTheme,
    ]
  );

  return (
    <SelectedFriendContext.Provider
      value={
        contextValue
        //   {
        //   selectedFriend,
        //   setFriend: setSelectedFriend,
        //   deselectFriend,
        //   friendLoaded: isSuccess,
        //   errorLoadingFriend: isError,
        //   loadingNewFriend: isLoading,
        //   isPending,
        //   isLoading,
        //   isSuccess,
        //   friendDashboardData,
        //   handleUpdateFavesTheme,
        // }
      }
    >
      {children}
    </SelectedFriendContext.Provider>
  );
};

//export default SelectedFriendContext;
