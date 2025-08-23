import React, { createContext, useState, useContext, useMemo } from "react";
import { Friend, FriendDashboardData } from "../types/FriendTypes";
 
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
 
 

  const selectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const deselectFriend = () => {
    setSelectedFriend(null); 
  };

  const contextValue = useMemo(
    () => ({
      selectedFriend,
      setFriend: setSelectedFriend,
      selectFriend,
      deselectFriend,  
    }),
    [
      selectedFriend,
      setSelectedFriend,
      selectFriend,
      deselectFriend, 
    ]
  );

  return (
    <SelectedFriendContext.Provider
      value={
        contextValue 
      }
    >
      {children}
    </SelectedFriendContext.Provider>
  );
}; 
