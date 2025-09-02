import React, { createContext, useState, useContext, useMemo } from "react";
import { Friend } from "../types/FriendTypes";

interface SelectedFriendType {
  selectedFriend: Friend | null;
  deselectFriend: () => void;
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
      selectFriend,
      deselectFriend,
    }),
    [selectedFriend, selectFriend, deselectFriend]
  );

  return (
    <SelectedFriendContext.Provider value={contextValue}>
      {children}
    </SelectedFriendContext.Provider>
  );
};
