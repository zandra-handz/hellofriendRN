import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react";
// import * as Device from "expo-device";
// import Constants from "expo-constants";
// import { Platform, AccessibilityInfo } from "react-native";
// import { useUser } from "./UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  updateUserAccessibilitySettings,
  updateSubscription,
  getUserSettings,
} from "../calls/api";

import { useUser } from "./UserContext";
// import * as Notifications from "expo-notifications";
// import * as SecureStore from "expo-secure-store";

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
  // const { user, isInitializing  } = useUser();
  console.error("USER SETTINGS CONTEXT");

//  useEffect(() => {
 
//     console.error('user in usersettings');
 

//  }, [user]);

//   useEffect(() => { 
//     console.error('initializing in usersettings');
 
//  }, [isInitializing]);

 
  const { user } = useUser();
 

  const {
    data: userSettings,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
      queryKey: ["userSettings"], // removed user id since entire cache should clear if user not logged in
    // queryKey: user?.id ? ["userSettings", user.id] : undefined,
    queryFn: () => getUserSettings(),
    enabled: !!(user),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });


  const [settings, setSettings] = useState<Record<string, any> | null>(null);




useEffect(() => {

  if (!isSuccess || !userSettings) {
    return;
  }

  setSettings(userSettings);
  // const applySettings = async () => {
  //   if (isSuccess && userSettings) {
  //     console.error("Resetting user settings");

 
  //     let updatedSettings = { ...userSettings };
 
  //     // try {
  //     //   const isActive = await AccessibilityInfo.isScreenReaderEnabled();
  //     //   updatedSettings.screen_reader = isActive;
  //     // } catch (error) {
  //     //   console.error("Error fetching screen reader status:", error);
  //     // }
 
  //     setSettings(updatedSettings);

     

   
  //   }
  // };

  // applySettings();
}, [isSuccess, userSettings]);

 
 

 
  const updateSettingsMutation = useMutation({
    mutationFn: (data) => updateUserAccessibilitySettings(data.setting),
    onSuccess: (data) => {
      setSettings(data); // Assuming the API returns updated settings
      console.log("APP SETTNGS RESET");

   
    },
    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const updateSettings = async (newSettings) => {
    console.log("updating settings!");
    try {
      await updateSettingsMutation.mutateAsync({
        // userId: user.user.id, // User ID
        fieldUpdates: newSettings, // Pass newSettings directly as fieldUpdates
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  // const registerForNotifications = async () => {
  //   console.warn('REGISTERING FOR NOTIFS!');
  //   if (Platform.OS === "android") {
  //     await Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

 

  
  // reset

  // DO I NEED?
  // useEffect(() => {
  //   if (isInitializing && !isAuthenticated) {
  //     console.log("user not authenticated, resetting user settings");
  //     setSettings(null);
  //     setNotificationSettings(null); // so as not to trigger consumers
  //   }
  // }, [isAuthenticated, isInitializing]);
 

  const contextValue = useMemo(
    () => ({
      // userSettings,
      settings,  
      updateSettings,
      updateSettingsMutation, 
      // registerForNotifications,
      // removeNotificationPermissions,
    }),
    [
    
      settings,  
      updateSettings,
      updateSettingsMutation,
      // registerForNotifications,
      // removeNotificationPermissions,
    ]
  );

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
};
