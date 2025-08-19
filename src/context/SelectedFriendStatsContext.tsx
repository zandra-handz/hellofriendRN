import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react";
import { useUser } from "./UserContext";
// import { useCategories } from "./CategoriesContext"; 
import { useSelectedFriend } from "./SelectedFriendContext";
import { useQuery,   useQueryClient } from "@tanstack/react-query";
import {  
  fetchCategoriesHistoryCountAPI,
 
} from "../calls/api";

interface SelectedFriendStatsContextType {}

const SelectedFriendStatsContext = createContext<
  SelectedFriendStatsContextType | undefined
>(undefined);

export const useSelectedFriendStats = (): SelectedFriendStatsContextType => {
  const context = useContext(SelectedFriendStatsContext);
  if (!context) {
    throw new Error(
      "useSelectedFriendStats must be used within a UserSettingsProvider"
    );
  }
  return context;
};

interface SelectedFriendStatsProviderProps {
  children: ReactNode;
}

export const SelectedFriendStatsProvider: React.FC<
  SelectedFriendStatsProviderProps
> = ({ children }) => {
  const { user, isInitializing } = useUser(); 
  const { selectedFriend } = useSelectedFriend(); 

  // const [selectedFriendStats, setSelectedFriendStats] = useState<
  //   Record<string, any>
  // >([]);
  const queryClient = useQueryClient();

  const {
    data: selectedFriendStats,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["selectedFriendStats", user?.id, selectedFriend?.id],
      queryFn: () => fetchCategoriesHistoryCountAPI({friendId: selectedFriend?.id, returnNonZeroesOnly: true}),
    // queryFn: () => fetchCategoriesFriendHistoryAPI(selectedFriend.id, false), //return non-empty categories only
    enabled: !!(
     
      user?.id &&
      !isInitializing &&
      selectedFriend && selectedFriend?.id
    ),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  // useEffect(() => {
  //   if (isSuccess && friendStats) {
  //   //   console.log("resetting selected friend stats", friendStats);
  //     setSelectedFriendStats(friendStats || []);
  //   }
  // }, [isSuccess, friendStats]);


// useEffect(() => {
//   if (user && user.id && isAuthenticated && !isInitializing && selectedFriend) {
//     queryClient.refetchQueries(["selectedFriendStats", user.id, selectedFriend.id]);
//   }
// }, [userCategories]);


const refetchFriendStats = () => {
     if ( user?.id  && !isInitializing && selectedFriend) {
    queryClient.refetchQueries(["selectedFriendStats", user.id, selectedFriend.id]);
  }

};


const invalidateFriendStats = () => {
     if (user?.id && !isInitializing && selectedFriend) {
    queryClient.invalidateQueries(["selectedFriendStats", user.id, selectedFriend.id]);
  }

};



  const contextValue = useMemo(
    () => ({
      selectedFriendStats,
      refetchFriendStats,
      invalidateFriendStats,
    }),
    [selectedFriendStats, refetchFriendStats, invalidateFriendStats]
  );

  return (
    <SelectedFriendStatsContext.Provider value={contextValue}>
      {children}
    </SelectedFriendStatsContext.Provider>
  );
};
