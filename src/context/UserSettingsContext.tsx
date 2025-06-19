import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, AccessibilityInfo } from "react-native";
import { useUser } from "./UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signup,
  signin,
  signinWithoutRefresh,
  signout,
  getCurrentUser,
  updateUserAccessibilitySettings,
  updateSubscription,
} from "../calls/api";

import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useGlobalStyle } from "./GlobalStyleContext";

import isEqual from "lodash.isequal";

interface UserSettings {
  id: number | null;
  user: number | null;
  expo_push_token: string | null;
  high_contrast_mode: boolean;
  interests: string | null;
  language_preference: string | null;
  large_text: boolean;
  manual_dark_mode: boolean;
  receive_notifications: boolean;
  screen_reader: boolean;
}

interface UserSettingsContextType {}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

export const useUserSettings = (): UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
};



interface UserSettingsProviderProps {
  children: ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({
  children,
}) => {
  const { user, isInitializing } = useUser();
  console.log("USER SETTINGS CONTEXT");

  const [notificationSettings, setNotificationSettings] = useState<
    Record<string, any>
  >({});
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<Record<string, any> | null>(null);


 

  // set
  useEffect(() => {
    if (isInitializing) {
      console.log("not setting (is still initializing");
      return;
    }
    if (user?.id) {
      console.log("setting settings");

      // POTENTIAL UNNECESSARY RERENDER
      // should get batched together in React 18+
      setSettings(user.settings || {});
      setNotificationSettings({
        receive_notifications: user.settings?.receive_notifications || false,
      });

    }  
  }, [user?.id, isInitializing]);


  // reset
  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (user?.authenticated) {
      return;
    } else {
      console.log("user not authenticated");
      setSettings(null); // so as not to trigger consumers
      setNotificationSettings(null); // so as not to trigger consumers
    }
  }, [user?.authenticated, isInitializing]);

  useEffect(() => {
    if (notificationSettings?.receive_notifications) {
      // register
      registerForNotifications();
    } else {
      // remove
      removeNotificationPermissions();
    }
  }, [notificationSettings]);

  //   useEffect(() => {
  //   if (user?.settings && !isEqual(user.settings, settings)) {
  //     setSettings(user.settings);
  //   }
  // }, [user?.settings]);

  const memoizedSettings = useMemo(() => {
    return user?.settings || {};
  }, [user]);

  //       setSettings(user.settings || {})
  // setNotificationSettings({
  //   receive_notifications: user.settings?.receive_notifications || false,
  // })

  const updateSettingsMutation = useMutation({
    mutationFn: (data) =>
      updateUserAccessibilitySettings(user?.id, data.setting),
    onSuccess: (data) => {
      setSettings(data); // Assuming the API returns updated settings
      console.log("APP SETTNGS RESET");

      // queryClient.setQueryData(["fetchUser"], (oldData) => ({
      //   ...oldData,
      //   settings: data.settings,
      // }));
    },
    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const updateSettings = async (newSettings) => {
    try {
      await updateSettingsMutation.mutateAsync({
        // userId: user.user.id, // User ID
        fieldUpdates: newSettings, // Pass newSettings directly as fieldUpdates
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

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
        console.log("UPDATED USER SETTINGS WITH NOTIFICATION SETTINGS");
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

  useEffect(() => {
    if (!user?.authenticated || !settings) return;

    const fetchInitialSettings = async () => {
      console.log("SCREEN READER CONTEXT");
      try {
        const isActive = await AccessibilityInfo.isScreenReaderEnabled();

        setSettings((prevSettings) => {
          // only update if value has changed
          if (prevSettings.screen_reader !== isActive) {
            return { ...prevSettings, screen_reader: isActive };
          }
          return prevSettings;
        });
      } catch (error) {
        console.error("Error fetching initial screen reader status:", error);
      }
    };

    fetchInitialSettings();
  }, [user?.authenticated, settings]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     return;
  //   }

  //   const screenReaderListener = AccessibilityInfo.addEventListener(
  //     "screenReaderChanged",

  //     async (isActive) => {
  //       console.log("SCREEN READER GLOBAL STYLE");
  //       if (user) {
  //         updateAppSettingsMutation.mutate({
  //           userId: user.id,
  //           setting: { screen_reader: isActive },
  //         });
  //       }
  //     }
  //   );
  //   return () => {
  //     screenReaderListener.remove();
  //   };
  // }, [isAuthenticated]);

  //working on removing and replacing with RQ mutation directly
  //this is mainly used in SectionSettingsAccessibility
  // const updateUserAccessibility = async (updates) => {
  //   try {
  //     //await updateUserAccessibilitySettings(authUserState.user.id, updates);
  //     updateSettingsMutation.mutate({
  //       ...userAppSettings,
  //       ...updates,
  //     });
  //   } catch (error) {
  //     console.error("Error updating user settings:", error);
  //   }
  // };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        notificationSettings,
        memoizedSettings,
        updateSettings,
        updateSettingsMutation,
        updateNotificationSettings: setNotificationSettings,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
