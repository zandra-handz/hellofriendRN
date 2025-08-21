import React, { createContext, useContext, useRef, useEffect } from "react";
import { useUser } from "./UserContext";
import { fetchUpcomingHelloes, remixAllNextHelloes } from "../calls/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
  return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, isInitializing, onSignOut } = useUser();
  const timeoutRef = useRef(null);

  const {
    data: upcomingHelloes,
    isLoading,
    isPending,
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

  const upcomingHelloesIsFetching = isPending;
  const upcomingHelloesIsSuccess = isSuccess;

  const refetchUpcomingHelloes = () => {
    // console.log('refetched upcoming!');
    // queryClient.invalidateQueries({ queryKey: ["upcomingHelloes", user?.id] });
    queryClient.refetchQueries({ queryKey: ["upcomingHelloes", user?.id] });
  };

  const remixAllNextHelloesMutation = useMutation({
    mutationFn: (data) => remixAllNextHelloes(data),
    onSuccess: (data) => {
      refetchUpcomingHelloes();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        remixAllNextHelloesMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        remixAllNextHelloesMutation.reset();
      }, 2000);
    },
  });

  const handleRemixAllNextHelloes = () => {
    try {
      remixAllNextHelloesMutation.mutate(user?.id);
    } catch (error) {
      console.log(`Error remixing helloes: `, error);
    }
  };

  return (
    <UpcomingHelloesContext.Provider
      value={{
        upcomingHelloes,
        upcomingHelloesIsFetching,
        upcomingHelloesIsSuccess,

        refetchUpcomingHelloes,
        handleRemixAllNextHelloes,
        remixAllNextHelloesMutation,

        isLoading,
      }}
    >
      {children}
    </UpcomingHelloesContext.Provider>
  );
};
