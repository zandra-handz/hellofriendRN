import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
  signup,
  signin,
  signinWithoutRefresh,
  signout,
  getCurrentUser,
  updateUserAccessibilitySettings,
  updateSubscription,
} from "../calls/api";

import { User } from "../types/UserContextTypes";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  userAppSettings: Record<string, any | null>;
  userNotificationSettings: Record<string, any>;
  onSignin: (username: string, password: string) => Promise<void>;
  onSignOut: () => void;
  onSignUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  reInitialize: () => Promise<void>;
  updateSettings: (newSettings: Record<string, any>) => Promise<void>;
  deAuthUser: () => void;
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

const TOKEN_KEY = "accessToken";

console.warn(`USER CONTEXT RERENDERED`);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
 

  const queryClient = useQueryClient();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // check SecureStore on mount
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
    retry: 3, //default anyway
  });

  const onSignOut = async () => {
    await signout();
    // setUser((prev) => (prev !== null ? null : prev));
    // setAuthenticated((prev) => (prev !== false ? false : prev));
 
queryClient.resetQueries(["currentUser"], { exact: true, refetchActive: false });

  queryClient.removeQueries({ exact: false }); // removes all queries
      queryClient.cancelQueries(); // cancel inflight queries
 //   queryClient.clear();
  
 
  };
  
  useEffect(() => {
    if (isError) {
      onSignOut();
    }
  }, [isError]);

  
  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      // console.warn("CHECKIGN IN CONTEXCREGKERFEFD");
      if (storedToken) {
        await refetch(); // only fetch if token exists
      } else {
        onSignOut();
      }
    })();
  }, []);

  const signinMutation = useMutation({
    mutationFn: signinWithoutRefresh,
    onSuccess: () => {
      // console.log("sign in successful!");
      //  reInitialize();
      refetch();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signinMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signinMutation.reset();
      }, 2000);
    },
  });


  const onSignin = useCallback(
    async (username: string, password: string) => {
      try {
        await signinMutation.mutateAsync({ username, password });
      } catch (error) {
        console.error("Sign in error", error);
      }
    },
    [signinMutation]
  );

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async (result) => {
      // if (result.data) {
      //     await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      //     await reInitialize(); // Refetch user data after sign-up
      // }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signupMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        signupMutation.reset();
      }, 2000);
    },
  });

  const onSignUp = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const credentials = { username, email, password };
      await signupMutation.mutateAsync(credentials);
      onSignin(username, password);
    } catch (error) {
      console.error("Sign up error", error);
    }
  };

  //   const deleteUserAccountMutation = useMutation({
  //     mutationFn: deleteUserAccount,
  //     onSuccess: () => {
  //       console.log("User deleted");
  //       onSignOut();

  //       if (timeoutRef.current) {
  //         clearTimeout(timeoutRef.current);
  //       }

  //       timeoutRef.current = setTimeout(() => {
  //         deleteUserAccountMutation.reset();
  //       }, 2000);
  //     },
  //     onError: (error) => {
  //       console.error("Sign in mutation error:", error);
  //       if (timeoutRef.current) {
  //         clearTimeout(timeoutRef.current);
  //       }

  //       timeoutRef.current = setTimeout(() => {
  //         deleteUserAccountMutation.reset();
  //       }, 2000);
  //     },
  //   });

  //   const handleDeleteUserAccount = async () => {
  //     try {
  //       await deleteUserAccountMutation.mutateAsync();
  //     } catch (error) {
  //       console.error("Delete user error", error);
  //     }
  //   };

  const contextValue = useMemo(
    () => ({
      user, 

      isAuthenticated: !!user,
      isInitializing: isLoading,
      onSignin,
      onSignUp,
      onSignOut, 
      signinMutation,
      signupMutation,
    }),
    [
      user, 
      onSignin,
      onSignUp,
      onSignOut, 
      signinMutation,
      signupMutation,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
