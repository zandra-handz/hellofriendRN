import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "./UserContext"; // Import useAuthUser hook
import { fetchFriendList } from "../calls/api";
import { useQuery } from "@tanstack/react-query";
import { Friend } from "../types/FriendTypes";
 

interface ThemeAheadOfLoading {
  darkColor: string;
  lightColor: string;
  fontColor: string;
  fontColorSecondary: string;
}

interface FriendListContextType {
  friendList: Friend[];
  setFriendList: (friends: Friend[]) => void;
  addToFriendList: (friend: Friend) => void;
  removeFromFriendList: (friendId: number) => void;
  updateFriend: (updatedFriend: Friend) => void;
  themeAheadOfLoading: ThemeAheadOfLoading,

}



const FriendListContext = createContext<FriendListContextType>({
  friendList: [],
  setFriendList: () => {},
  addToFriendList: () => {},
  removeFromFriendList: () => {},
  updateFriend: () => {}, 
    themeAheadOfLoading: {
    darkColor: "#4caf50",
    lightColor: "#a0f143",
    fontColor: "#000000",
    fontColorSecondary: "#000000",
  },
});

export const useFriendList = (): FriendListContextType =>
  useContext(FriendListContext);

interface FriendListProviderProps {
  children: ReactNode;
}

export const FriendListProvider: React.FC<FriendListProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated, isInitializing, onSignOut } = useUser(); 
  const [friendList, setFriendList] = useState<Friend[]>([]);

  const [useGradientInSafeView, setUseGradientInSafeView] = useState(false);
  console.log("FRIEND LIST RERENDERED");
  const [themeAheadOfLoading, setThemeAheadOfLoading] = useState({
    darkColor: "#4caf50",
    lightColor: "#a0f143",
    fontColor: "#000000",
    fontColorSecondary: "#000000",
  });

  const updateSafeViewGradient = (boolean: boolean) => {
    setUseGradientInSafeView((prev) => boolean);
  };

  const getThemeAheadOfLoading = (loadingFriend: Friend) => {
    setThemeAheadOfLoading({
      // lightColor: loadingFriend.lightColor || "#a0f143",
      // darkColor: loadingFriend.darkColor || "#4caf50",
      // fontColor: loadingFriend.fontColor || "#000000",
      // fontColorSecondary: loadingFriend.fontColorSecondary || "#000000",
      lightColor: loadingFriend.theme_color_light || "#a0f143",
      darkColor: loadingFriend.theme_color_dark || "#4caf50",
      fontColor: loadingFriend.theme_color_font || "#000000",
      fontColorSecondary: loadingFriend.theme_color_font_secondary || "#000000",
    });
  };

  const resetTheme = () => {
    setThemeAheadOfLoading({
      lightColor: "#a0f143",
      darkColor: "#4caf50",
      fontColor: "#000000",
      fontColorSecondary: "#000000",
    });
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
      return friendData;
      // return friendData.map((friend) => ({
      //   id: friend.id,
      //   name: friend.name,
      //   savedDarkColor: friend.saved_color_dark || "#4caf50",
      //   savedLightColor: friend.saved_color_light || "#a0f143",
      //   darkColor: friend.theme_color_dark || "#4caf50",
      //   lightColor: friend.theme_color_light || "#a0f143",
      //   fontColor: friend.theme_color_font || "#000000",
      //   fontColorSecondary: friend.theme_color_font_secondary || "#000000",
      // }));
    },
    retry: 3,
    enabled: !!(user && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  useEffect(() => {
    if (isError) {
      onSignOut();
    }
  }, [isError]);

  useEffect(() => {
    if (friendListIsSuccess && friendListData) {
      setFriendList(friendListData);
 
    }
  }, [friendListIsSuccess, friendListData]);

  const addToFriendList = (newFriend: Friend) => {
    setFriendList((prevFriendList) => {
      const isAlreadyFriend = prevFriendList.some(
        (friend) => friend.id === newFriend.id
      );
      if (!isAlreadyFriend) {
        return [...prevFriendList, newFriend];
      }
      return prevFriendList;
    });
  };

const removeFromFriendList = (friendIdToRemove: number | number[]) => {
  setFriendList((prevFriendList) => {
    try {
      const idsToRemove = Array.isArray(friendIdToRemove)
        ? friendIdToRemove
        : [friendIdToRemove];
      // console.log("friend removed from friend list!");
      return prevFriendList.filter(
        (friend) => !idsToRemove.includes(friend.id)
      );
    } catch (error) {
      console.log("error removing friend from list: ", error);
      return prevFriendList; 
    }
  });
};

  const friendListLength = friendList.length;
 
  const updateFriend = (updatedFriend: Friend) => {
    setFriendList((prev) =>
      prev.map((friend) =>
        friend.id === updatedFriend.id ? updatedFriend : friend
      )
    );
  };

  const updateFriendListColors = (
    friendId: number,
    darkColor: string,
    lightColor: string,
    fontColor: string,
    fontColorSecondary: string
  ) => {
    setFriendList((prevFriendList) =>
      prevFriendList.map((friend) =>
        friend.id === friendId
        ? {
            ...friend,
            theme_color_dark: darkColor,
            saved_color_dark: darkColor,
            theme_color_light: lightColor,
            saved_color_light: lightColor,
            theme_color_font: fontColor,
            theme_color_font_secondary: fontColorSecondary,
          }
          : friend
      )
    );
    setThemeAheadOfLoading({
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    });
  };

 

  const updateFriendListColorsExcludeSaved = (
    friendId: number,
    darkColor: string,
    lightColor: string,
    fontColor: string,
    fontColorSecondary: string,
  ) => {
setFriendList((prevFriendList) =>
  prevFriendList.map((friend) =>
    friend.id === friendId
      ? {
          ...friend,
          theme_color_dark: darkColor,
          theme_color_light: lightColor,
          theme_color_font: fontColor,
          theme_color_font_secondary: fontColorSecondary,
          // saved colors NOT updated here
        }
      : friend
  ) 

    );

    setThemeAheadOfLoading({
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    });
  };
 
  const contextValue = useMemo(
    () => ({
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
    }),
    [friendList, friendListLength, themeAheadOfLoading, useGradientInSafeView]
  );

  return (
    <FriendListContext.Provider value={contextValue}>
      {children}
    </FriendListContext.Provider>
  );
};
