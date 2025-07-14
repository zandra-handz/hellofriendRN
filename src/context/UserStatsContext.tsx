import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react"; 
import { useUser } from "./UserContext"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchCategoriesHistoryAPI,
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
  const { user, isInitializing, isAuthenticated } = useUser();
 
  // console.log("USER STATS CONTEXT");

  // const [stats, setStats] = useState<
  //   Record<string, any>
  // >([]);
  const queryClient = useQueryClient();

  const {
    data: stats,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => fetchCategoriesHistoryCountAPI({returnNonZeroesOnly: true}), //return non-empty categories only
    enabled: !!(user?.id),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  
  });

// useEffect(() => {
//   if (isSuccess && userStats) {
//     console.log('!~!~!~!~!~!~!~!~!~!~!~!resetting user stats');
//     setStats(userStats|| []); 
   
//   }
// }, [isSuccess, userStats]);


// useEffect(() => {
//   if (user && isAuthenticated && !isInitializing) {
//     console.log('~~~~J~J~J~JK~KJ~KJ~');
//     queryClient.refetchQueries(["userStats", user.id]);
//   }
// }, [userCategories]);
  

 
 const refetchUserStats = () => {
     if (user && isAuthenticated && !isInitializing) {
    queryClient.refetchQueries(["userStats", user.id]);  //also manually added this to categories context
  }

};


const invalidateUserStats = () => {
     if (user && user.id && isAuthenticated && !isInitializing) {
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
