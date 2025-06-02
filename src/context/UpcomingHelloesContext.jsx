import React, { createContext, useContext, useRef } from "react";
import { useUser } from "./UserContext";
import { fetchUpcomingHelloes, remixAllNextHelloes } from "../calls/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const UpcomingHelloesContext = createContext({});

export const useUpcomingHelloes = () => {
  return useContext(UpcomingHelloesContext);
};

export const UpcomingHelloesProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isInitializing } = useUser();
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
    enabled: isAuthenticated && !isInitializing,
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {}, 2000);
    },
    onError: (error) => {
      console.log("Error occurred:", error);
    },
    select: (data) => {
      if (isError) {
        return [];
      }
      return data || [];
    },
  });

  const upcomingHelloesIsFetching = isPending;
  const upcomingHelloesIsSuccess = isSuccess;

  const refetchUpcomingHelloes = () => {
    queryClient.invalidateQueries({ queryKey: ["upcomingHelloes", user?.id] });
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

  const handleRemixAllNextHelloes = (userId) => {
    try {
      remixAllNextHelloesMutation.mutate(userId);
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
