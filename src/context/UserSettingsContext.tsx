import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react";
import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import {
  updateUserAccessibilitySettings,
  updateSubscription,
  getUserSettings,
} from "../calls/api";

import { useUser } from "./UserContext";
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
  const { user, isAuthenticated, isInitializing } = useUser();
const queryClient = useQueryClient();
  

  const {
   // data: userSettings,
 data: settings,
    isSuccess,
 
  } = useQuery({
    queryKey: ["userSettings", user?.id], // removed user id since entire cache should clear if user not logged in
    // queryKey: user?.id ? ["userSettings", user.id] : undefined,
    queryFn: () => getUserSettings(),
    enabled: !!(user?.id && isAuthenticated && !isInitializing),
    retry: 3,
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  // useEffect(() => {
  //   console.error("user triggering settings!!!", user);
  // }, [user]);

  // const [settings, setSettings] = useState<Record<string, any> | null>(null);

  // useEffect(() => {
  //   if (!isSuccess || !userSettings) {
  //     return;
  //   }
  //   console.log('use effect in settings getting fired');
  //   setSettings((prev) => (isEqual(prev, userSettings) ? prev : userSettings));
  // }, [isSuccess, userSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => updateUserAccessibilitySettings(data.setting),
    onSuccess: (data) => {
      // ✅ update the cache so consumers re-render immediately
      queryClient.setQueryData(["userSettings", user?.id], data);

      console.log("APP SETTINGS RESET");
    },
    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const updateSettings = async (newSettings) => {
    console.log("updating settings!", newSettings);
    try {
      await updateSettingsMutation.mutateAsync({
        // userId: user.user.id, // User ID
        setting: newSettings, // Pass newSettings directly as fieldUpdates
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      updateSettingsMutation,
    }),
    [settings, updateSettings, updateSettingsMutation]
  );

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
};
