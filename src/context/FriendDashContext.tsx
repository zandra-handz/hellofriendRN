import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "./UserContext";
import { fetchFriendDashboard } from "../calls/api";
import { useQuery } from "@tanstack/react-query";
import { FriendDashboardData } from "../types/FriendTypes";
 
import { useSelectedFriend } from "./SelectedFriendContext"; 
const FriendDashContext = createContext<FriendDashboardData | undefined>(
  undefined
);

export const useFriendDash = () => {
  const context = useContext(FriendDashContext);

  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendProvider"
    );
  }
  return context;
};

interface FriendDashProviderProps {
  children: React.ReactNode;
}

export const FriendDashProvider: React.FC<FriendDashProviderProps> = ({
  children,
}) => {
  const { selectedFriend } = useSelectedFriend();

  

  const { user, isInitializing } = useUser();

  console.log('FRIEND DASH RERENDEREERRERERERED           RJEFK REK EFLK                   Rr')

  const {
    data: friendDash,
    isLoading, 
    isError,
    isSuccess,
  } = useQuery<FriendDashboardData>({
    queryKey: ["friendDashboardData", user?.id, selectedFriend?.id],
    queryFn: () => fetchFriendDashboard(selectedFriend?.id),

    enabled: !!(user?.id && selectedFriend?.id && !isInitializing), //testing removing !isInitializing
    staleTime: 1000 * 60 * 20,
  });

  const contextValue = useMemo(
    () => ({
      loadingDash: isLoading,
      dashLoaded: isSuccess,
      friendDash,
    }),
    [isSuccess, isLoading,
      //  isPending, 
       friendDash]
  );

  return (
    <FriendDashContext.Provider value={contextValue}>
      {children}
    </FriendDashContext.Provider>
  );
};
