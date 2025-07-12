import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react"; 
import { useUser } from "./UserContext";
import { useCategories } from "./CategoriesContext";
import { useUserSettings } from "./UserSettingsContext";
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
  const { userCategories } = useCategories();
  console.log("USER STATS CONTEXT");

  const [stats, setStats] = useState<
    Record<string, any>
  >([]);
  const queryClient = useQueryClient();

  const {
    data: userStats,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => fetchCategoriesHistoryCountAPI(true), //return non-empty categories only
    enabled: !!(user && user.id && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  
  });

useEffect(() => {
  if (isSuccess && userStats) {
    console.log('resetting user stats');
    setStats(userStats|| []); 
   
  }
}, [isSuccess, userStats]);


useEffect(() => {
  if (user && user.id && isAuthenticated && !isInitializing) {
    queryClient.refetchQueries(["userStats", user.id]);
  }
}, [userCategories]);
  
 
 
 const refetchUserStats = () => {
     if (user && user.id && isAuthenticated && !isInitializing) {
    queryClient.refetchQueries(["userStats", user.id]);
  }

};


const invalidateUserStats = () => {
     if (user && user.id && isAuthenticated && !isInitializing) {
    queryClient.invalidateQueries(["userStats", user.id]);
  }

};

const handleGetCategoryCapsules = (categoryId) => {
  console.log(categoryId);
  try {
    categoryCapsulesMutation.mutate(categoryId);

  } catch (error) {
    console.error("Error getting category capsules");
  }

};

const categoryCapsulesMutation = useMutation({
  mutationFn: (categoryId) => 
    fetchCategoriesHistoryAPI(categoryId, true),
  onSuccess: (data) => {
    console.log(data);
    
    //add to cache here
  },
  onError: (error) => {
    console.error("Error getting category capsule history");
  }
})



  const contextValue = useMemo(() => ({
  stats,
  refetchUserStats,
  invalidateUserStats,
  handleGetCategoryCapsules,
}), [
  stats,
  refetchUserStats,
  invalidateUserStats,
  handleGetCategoryCapsules,
]);


  return (
<UserStatsContext.Provider value={contextValue}>
  {children}
</UserStatsContext.Provider>

  );
};
