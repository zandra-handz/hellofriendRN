import React, { createContext, useContext, useMemo, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signout } from "../calls/helloFriendApiClient";
import { getCurrentUser } from "../calls/api";
import { User } from "../types/UserContextTypes";

interface UserContextType {
  user: User | null;
  refetch: () => void;
  isInitializing: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isError,
    isPending, //this is just pre-fetch
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: false, // never auto-run
    retry: 3,
  });

  const onSignOutContextVersion = async () => {
    await signout();

    queryClient.resetQueries(["currentUser"], {
      exact: true,
      refetchActive: false,
    });

    queryClient.removeQueries({ exact: false }); // removes all queries
    queryClient.cancelQueries();
  };

  useEffect(() => {
    if (isError) {
      onSignOutContextVersion();
    }
  }, [isError]);

  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      if (storedToken) {
        await refetch();
      } else {
        onSignOutContextVersion();
      }
    })();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isInitializing: isLoading,
      refetch,
    }),
    [user, isLoading, refetch],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
