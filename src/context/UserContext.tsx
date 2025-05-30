import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,

} from "react";
import {   AccessibilityInfo,
  Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
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

  let isReinitializing = false;

  const reInitialize = async () => {
    console.log("REINT TRIGGERED");
    if (isReinitializing) {
      return;
    }

    isReinitializing = true;
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored token: ", token);

      if (token) {
        let userData = null;

        try {
          userData = await getCurrentUser();
        } catch (error) {
          await onSignOut();
          return;
        }

        if (userData) {
          setUser(userData);
          setAuthenticated(true);

          // FIX
          setUserAppSettings(userData.settings || {});
          setUserNotificationSettings({
            receive_notifications:
              userData.settings?.receive_notifications || false,
          });
          /////////////////////////////////////////////////////////

        } else {
          console.log("setting user auth to false");
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

  function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

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
    useEffect(() => {
      const fetchInitialSettings = async () => {
        //  console.log("SCREEN READER CONTEXT");
        try {
          const isActive = await AccessibilityInfo.isScreenReaderEnabled();
          setUserAppSettings((prevSettings) => ({
            ...prevSettings,
            screen_reader: isActive,
          }));
        } catch (error) {
          console.error("Error fetching initial screen reader status:", error);
        }
      };
  
      if (authenticated && userAppSettings) {
        fetchInitialSettings();
      }
    }, [authenticated]);

  const onSignOut = async () => {
    await signout();
    setUser(null);
    setUserAppSettings(null);
    setUserNotificationSettings(null);
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

  const updateAppSettings = async (newSettings) => {
    try {
      await updateAppSettingsMutation.mutateAsync({
        userId: user.user.id, // User ID
        fieldUpdates: newSettings, // Pass newSettings directly as fieldUpdates
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  const updateAppSettingsMutation = useMutation({
    mutationFn: (data) =>
      updateUserAccessibilitySettings(data.userId, data.setting),
    onSuccess: (data) => {
      setUserAppSettings(data); // Assuming the API returns updated settings

      queryClient.setQueryData(["fetchUser"], (oldData) => ({
        ...oldData,
        settings: data.settings,
      }));
    },
    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  
  useEffect(() => {
    if (userNotificationSettings?.receive_notifications) {
      // register
      registerForNotifications();
    } else {
      // remove
      removeNotificationPermissions();
    }
  }, [userNotificationSettings]);

  const registerForNotifications = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;
        await SecureStore.setItemAsync("pushToken", pushTokenString);
        await updateUserAccessibilitySettings(user.id, {
          receive_notifications: true,
          expo_push_token: pushTokenString,
        });
      }
    }
  };

  const removeNotificationPermissions = async () => {
    await SecureStore.deleteItemAsync("pushToken");
    if (user) {
      await updateUserAccessibilitySettings(user.id, {
        receive_notifications: false,
        expo_push_token: null,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: authenticated,
        userAppSettings,
        userNotificationSettings,
        onSignin,
        onSignUp,
        onSignOut,
        reInitialize,
        // handleDeleteUserAccount,
        // deleteUserAccountMutation,
        updateAppSettingsMutation,
        updateAppSettings,

        updateUserSettings: setUserAppSettings, // .... ?????
        updateUserNotificationSettings: setUserNotificationSettings,
        signinMutation,
        signupMutation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
