import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useUser } from "./UserContext";
import { fetchUpcomingHelloes } from "../calls/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// remix helloes is in a separate hook
const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
  return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, onSignOut } = useUser();
 

  const {
    data: upcomingHelloes,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["upcomingHelloes", user?.id],
    queryFn: () => fetchUpcomingHelloes(),
    enabled: !!user?.id, //removed isInitializing to test
    retry: 3,
    staleTime: 1000 * 60 * 20, // 20 minutes

    select: (data) => {
      if (isError) {
        return [];
      }
      return data || [];
    },
  });

  useEffect(() => {
    if (isError) {
      onSignOut();
    }
  }, [isError]);

  const refetchUpcomingHelloes = () => {
    queryClient.refetchQueries({ queryKey: ["upcomingHelloes", user?.id] });
  };

  const contextValue = useMemo(
    () => ({
      upcomingHelloes,
      upcomingHelloesIsFetching: isFetching,
      upcomingHelloesIsSuccess: isSuccess,

      refetchUpcomingHelloes,

      isLoading,
    }),
    [upcomingHelloes, isFetching, isSuccess, refetchUpcomingHelloes, isLoading]
  );

  return (
    <UpcomingHelloesContext.Provider value={contextValue}>
      {children}
    </UpcomingHelloesContext.Provider>
  );
};
