import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { AccessibilityInfo, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { startTransition } from "react";
//import useProtectedRoute from "../hooks/useProtectedRoute";
// import {
//   signup,
//   signinWithoutRefresh,
//   signout,
//   getCurrentUser,
//   deleteUserAccount,
// } from "../calls/apicalls";
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

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userAppSettings, setUserAppSettings] = useState<Record<
    string,
    any
  > | null>(null);
  const [userNotificationSettings, setUserNotificationSettings] = useState<
    Record<string, any>
  >({});
  const queryClient = useQueryClient();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('user context rerendered');

  let isReinitializing = false;

  const reInitialize = async () => {
    console.log("REINT TRIGGERED");
    if (isReinitializing) {
      return;
    }

    isReinitializing = true;
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
          //console.log('userData returned from backend');
          startTransition(() => {
            setUser(userData);
            console.log('userdata set');
            setAuthenticated(true);
            console.log('authenticated set');
           
          }); 
        } else {
          console.log("not authenticated");
          setUser(null);
          setAuthenticated(false);
          queryClient.clear();
        }
      } else {
        setUser(null);
        setAuthenticated(false);
        queryClient.clear();
      }
    } finally {
      isReinitializing = false;
    }
  };

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

  const onSignin = async (username: string, password: string) => {
    try {
      await signinMutation.mutateAsync({ username, password });
    } catch (error) {
      console.error("Sign in error", error);
    }
  };

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
    setUser(null);
    // setUserAppSettings(null);
    // setUserNotificationSettings(null);
    setAuthenticated(false);

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
    ]
  );

 
  return (
    <UserContext.Provider
      value={contextValue}
    >
      {children}
    </UserContext.Provider>
  );
};
