import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useQuery  } from "@tanstack/react-query";
import { 
  getUserSettings,
} from "../calls/api";

import { useUser } from "./UserContext";

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
  lock_in_next: boolean;
  lock_in_custom_string: string;
  simplify_app_for_focus: boolean;
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
 

  const { data: settings, isLoading: loadingSettings, isSuccess: settingsLoaded } = useQuery({
    queryKey: ["userSettings", user?.id],
    queryFn: () => getUserSettings(),
    enabled: !!user?.id && !isInitializing,  //testing removing this
    retry: 3,
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

 
 
  const contextValue = useMemo(
    () => ({

      settings, loadingSettings, settingsLoaded
    }),
    [settings, loadingSettings, settingsLoaded ]
  );

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
};
