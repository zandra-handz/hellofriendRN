import React, {
  createContext,
  useContext,
  // useRef,
  useMemo,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signout } from "../calls/helloFriendApiClient";
// import useSignOut from "../hooks/UserCalls/useSignOut";
import { getCurrentUser } from "../calls/api";
// import useSignIn from "../hooks/UserCalls/useSignIn";
// import useSignUp from "../hooks/UserCalls/useSignUp";
import { User } from "../types/UserContextTypes";

interface UserContextType {
  user: User | null;
  refetch: () => void;
  isAuthenticated: boolean;
  isInitializing: boolean;
  userAppSettings: Record<string, any | null>;
  userNotificationSettings: Record<string, any>;

  handleDeleteUserAccount: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// LEAVE THIS HERE FOR REFERENCE, IT IS CORRECT I JUST DON'T NEED A VARIABLE BECAUSE IT IS ONLY USED ONCE
// const TOKEN_KEY = "accessToken";

// console.warn(`USER CONTEXT RERENDERED`);

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
      // onSignOut();
    }
  }, [isError]);

  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      if (storedToken) {
        await refetch();
      } else {
        // onSignOut();
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
    [user, isLoading, refetch]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
