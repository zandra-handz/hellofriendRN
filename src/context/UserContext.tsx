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
import { useMutation, useQueryClient } from "@tanstack/react-query";
 
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
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const queryClient = useQueryClient();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // console.log("user context rerendered");
  const isReinitializingRef = useRef(false);

  const reInitialize = useCallback(async () => {
    if (isReinitializingRef.current) return;
    isReinitializingRef.current = true;

    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        let userData = null;

        try {
          userData = await getCurrentUser();
        } catch (error) {
          await onSignOut();
          return;
        }

        if (userData) {
          setUser((prev) => {
            const isEqual = JSON.stringify(prev) === JSON.stringify(userData);
            return !isEqual ? userData : prev;
          });

          setAuthenticated((prev) => (!prev ? true : prev));
        } else {
          await onSignOut();
        }
      } else {
        await onSignOut();
      }
    } finally {
      isReinitializingRef.current = false;
    }
  }, [onSignOut]);

  const signinMutation = useMutation({
    mutationFn: signinWithoutRefresh,
    onSuccess: () => {
      console.log("sign in successful!");
      reInitialize();

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

  const onSignOut = async () => {
    await signout();
    setUser((prev) => (prev !== null ? null : prev));
    setAuthenticated((prev) => (prev !== false ? false : prev));
    // setUser(null);
    // setAuthenticated(false);
    queryClient.clear();
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
      isAuthenticated: authenticated,
      isInitializing: isReinitializingRef.current,
      onSignin,
      onSignUp,
      onSignOut,
      reInitialize,
      signinMutation,
      signupMutation,
    }),
    [
      user,
      authenticated,
      onSignin,
      onSignUp,
      onSignOut,
      reInitialize,
      signinMutation,
      signupMutation,
      isReinitializingRef,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
