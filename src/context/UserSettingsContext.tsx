import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useQuery  } from "@tanstack/react-query";
import { 
  getUserSettings,
} from "../calls/api";

// import { useUser } from "./UserContext";
import useUser from "../hooks/useUser";

import {  UserSettingsContextType } from "../types/UserSettingsTypes";

 

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
