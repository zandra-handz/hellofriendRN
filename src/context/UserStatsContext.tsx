import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react"; 
import { useUser } from "./UserContext"; 
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  
  fetchCategoriesHistoryCountAPI,
} from "../calls/api";
 
  
interface UserStatsContextType {}

const UserStatsContext = createContext<UserStatsContextType | undefined>(
  undefined
);

export const useUserStats = (): UserStatsContextType => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error(
      "useUserStats must be used within a UserSettingsProvider"
    );
  }
  return context;
};

interface UserStatsProviderProps {
  children: ReactNode;
}

export const UserStatsProvider: React.FC<UserStatsProviderProps> = ({
  children,
}) => {
  const { user, isInitializing } = useUser();
 
 
  const queryClient = useQueryClient();

  const {
    data: stats,
  
  } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => fetchCategoriesHistoryCountAPI({returnNonZeroesOnly: true}), //return non-empty categories only
    enabled: !!user?.id, // testing removing this && !isInitializing,
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  
  }); 

 
 const refetchUserStats = () => {
     if (user && !isInitializing) {
    queryClient.refetchQueries(["userStats", user.id]);  //also manually added this to categories context
  }

};


const invalidateUserStats = () => {
     if (user && user.id && !isInitializing) {
    queryClient.invalidateQueries(["userStats", user.id]);
  }

};

 



  const contextValue = useMemo(() => ({
  stats,
  refetchUserStats,
  invalidateUserStats, 
}), [
  stats,
  refetchUserStats,
  invalidateUserStats, 
]);


  return (
<UserStatsContext.Provider value={contextValue}>
  {children}
</UserStatsContext.Provider>

  );
};
