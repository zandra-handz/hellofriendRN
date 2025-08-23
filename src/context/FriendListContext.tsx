import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "./UserContext"; 
import { fetchFriendList } from "../calls/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Friend } from "../types/FriendTypes"; 
import useSignOut from "../hooks/UserCalls/useSignOut";
interface FriendListContextType {
  friendList: Friend[];
  setFriendList: (friends: Friend[]) => void;
  addToFriendList: (friend: Friend) => void;
  removeFromFriendList: (friendId: number) => void;
  updateFriend: (updatedFriend: Friend) => void;
 
}


const FriendListContext = createContext<FriendListContextType>({
  friendList: [],
  setFriendList: () => {},
  addToFriendList: () => {},
  removeFromFriendList: () => {},
  updateFriend: () => {},
  
});

export const useFriendList = (): FriendListContextType =>
  useContext(FriendListContext);

interface FriendListProviderProps {
  children: ReactNode;
}

export const FriendListProvider: React.FC<FriendListProviderProps> = ({
  children,
}) => {
  const { user, isInitializing  } = useUser();
  const { onSignOut } = useSignOut();
  // const [friendList, setFriendList] = useState<Friend[]>([]);
const queryClient = useQueryClient();

  const {
  data: friendList = [],
  isSuccess: friendListIsSuccess,
  isError,
} = useQuery({
  queryKey: ["friendList", user?.id],
  queryFn: () => fetchFriendList(),
  retry: 3,
  enabled: !!user?.id,
  staleTime: 1000 * 60 * 60 * 10, // 10 hours
});

useEffect(() => {
  if (isError) {
    onSignOut();
  }
}, [isError]);

// Add friend
const addToFriendList = (newFriend: Friend) => {
  queryClient.setQueryData<Friend[]>(["friendList", user?.id], (old = []) => {
    const isAlreadyFriend = old.some((friend) => friend.id === newFriend.id);
    if (!isAlreadyFriend) {
      return [...old, newFriend];
    }
    return old;
  });
};

// Remove friend(s)
const removeFromFriendList = (friendIdToRemove: number | number[]) => {
  queryClient.setQueryData<Friend[]>(["friendList", user?.id], (old = []) => {
    const idsToRemove = Array.isArray(friendIdToRemove)
      ? friendIdToRemove
      : [friendIdToRemove];
    return old.filter((friend) => !idsToRemove.includes(friend.id));
  });
};

// Update friend
const updateFriend = (updatedFriend: Friend) => {
  queryClient.setQueryData<Friend[]>(["friendList", user?.id], (old = []) =>
    old.map((friend) =>
      friend.id === updatedFriend.id ? updatedFriend : friend
    )
  );
};
 
 
  // const {
  //   data: friendListData = [],
 
  //   isSuccess: friendListIsSuccess,
  //   isError,
  // } = useQuery({
  //   queryKey: ["friendList", user?.id],
  //   queryFn: () => fetchFriendList(),
  //   retry: 3,
  //   enabled: !!(user?.id), // && !isInitializing),  testing removing this
  //   staleTime: 1000 * 60 * 60 * 10, // 10 hours
  // });

  // useEffect(() => {
  //   if (isError) {
  //     onSignOut();
  //   }
  // }, [isError]);

  // useEffect(() => {
  //   if (friendListIsSuccess && friendListData) {
  //     setFriendList(friendListData);
  //   }
  // }, [friendListIsSuccess, friendListData]);

  // const addToFriendList = (newFriend: Friend) => {
  //   setFriendList((prevFriendList) => {
  //     const isAlreadyFriend = prevFriendList.some(
  //       (friend) => friend.id === newFriend.id
  //     );
  //     if (!isAlreadyFriend) {
  //       return [...prevFriendList, newFriend];
  //     }
  //     return prevFriendList;
  //   });
  // };

  // const removeFromFriendList = (friendIdToRemove: number | number[]) => {
  //   setFriendList((prevFriendList) => {
  //     try {
  //       const idsToRemove = Array.isArray(friendIdToRemove)
  //         ? friendIdToRemove
  //         : [friendIdToRemove]; 
  //       return prevFriendList.filter(
  //         (friend) => !idsToRemove.includes(friend.id)
  //       );
  //     } catch (error) {
  //       console.log("error removing friend from list: ", error);
  //       return prevFriendList;
  //     }
  //   });
  // };
 

  // const updateFriend = (updatedFriend: Friend) => {
  //   setFriendList((prev) =>
  //     prev.map((friend) =>
  //       friend.id === updatedFriend.id ? updatedFriend : friend
  //     )
  //   );
  // };

 

  const contextValue = useMemo(
    () => ({
      friendList,
      // setFriendList, 
      addToFriendList,
      removeFromFriendList,
      updateFriend, 
    }),
    [
      friendList, 
      addToFriendList,
      removeFromFriendList,
      updateFriend, 
    ]
  );

  return (
    <FriendListContext.Provider value={contextValue}>
      {children}
    </FriendListContext.Provider>
  );
};
