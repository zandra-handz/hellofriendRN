import React, {
  createContext,
  useContext,
  useRef,
  useMemo,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import useSignOut from "../hooks/UserCalls/useSignOut";
import {
  signup,
  signin,
  signinWithoutRefresh,
  getCurrentUser,
  updateUserAccessibilitySettings,
  updateSubscription,
} from "../calls/api";
import useSignIn from "../hooks/UserCalls/useSignIn";
import useSignUp from "../hooks/UserCalls/useSignUp";
import { User } from "../types/UserContextTypes";

interface UserContextType {
  user: User | null;
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

const TOKEN_KEY = "accessToken";

console.warn(`USER CONTEXT RERENDERED`);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { onSignOut } = useSignOut();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const { onSignIn } = useSignIn({ refetchUser: refetch });
  const { onSignUp } = useSignUp({ signInNewUser: onSignIn });

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

  // const signupMutation = useMutation({
  //   mutationFn: signup,
  //   onSuccess: async (result) => {
  //     // if (result.data) {
  //     //     await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
  //     //     await reInitialize(); // Refetch user data after sign-up
  //     // }
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }

  //     timeoutRef.current = setTimeout(() => {
  //       signupMutation.reset();
  //     }, 2000);
  //   },
  //   onError: () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //     timeoutRef.current = setTimeout(() => {
  //       signupMutation.reset();
  //     }, 2000);
  //   },
  // });

  // const onSignUp = async (
  //   username: string,
  //   email: string,
  //   password: string
  // ) => {
  //   try {
  //     const credentials = { username, email, password };
  //     await signupMutation.mutateAsync(credentials);
  //     onSignIn(username, password);
  //   } catch (error) {
  //     console.error("Sign up error", error);
  //   }
  // };

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
      isInitializing: isLoading,
      refetch,
    }),
    [user, isLoading, refetch]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
